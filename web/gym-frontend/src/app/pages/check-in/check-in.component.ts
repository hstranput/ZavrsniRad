import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { ZXingScannerModule } from '@zxing/ngx-scanner'; 

@Component({
  selector: 'app-check-in',
  standalone: true,
  imports: [CommonModule, ZXingScannerModule], 
  templateUrl: './check-in.component.html',
})
export class CheckInComponent {
  private apiService = inject(ApiService);
  private router = inject(Router);

  // poruka za korisnika koja se prikazuje ispod skenera
  public message: string = 'Usmjerite kameru na QR kod na ekranu.';

  // tip poruke (info, success, danger) - bootstrap stilovi
  public messageType: 'info' | 'success' | 'danger' = 'info';

  // je li omogućena kamera
  public scannerEnabled = true;

  // event kad se QR kod uspješno pročita
  onScanSuccess(result: string) {
    if (!result) return; // ako je prazan rezultat, ignoriraj
 
    this.scannerEnabled = false;  // gasi kameru da ne skenira opet isti kod
    this.message = 'Kod skeniran, provjeravam...';

    // šalji kod backendu na provjeru
    this.apiService.qrCheckIn(result).subscribe({
      next: (response) => {
        // ako je uspješno, prikaži poruku i preusmjeri na dashboard
        this.messageType = 'success';
        this.message = response.message;

        setTimeout(() => this.router.navigate(['/dashboard']), 2000);
      },
      error: (err) => {
        // ako je došlo do greške, prikaži crvenu poruku
        this.messageType = 'danger';
        this.message = err.error.message || 'Došlo je do greške.';

        // nakon 2 sekunde vrati kameru da korisnik može probati opet
        setTimeout(() => {
          this.message = 'Pokušajte ponovno.';
          this.messageType = 'info';
          this.scannerEnabled = true;
        }, 2000);
      }
    });
  }
}
