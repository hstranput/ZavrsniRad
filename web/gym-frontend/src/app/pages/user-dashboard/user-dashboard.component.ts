import { Component, OnInit, inject } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { MyCheckInsResponse, OccupancyResponse } from '../../interfaces/api-response';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss']  
})
export class UserDashboardComponent implements OnInit {
  private apiService = inject(ApiService);

  // Observable koji dohvaća statistiku prijava trenutnog korisnika
  myStats$!: Observable<MyCheckInsResponse>;
  
  // Observable koji dohvaća trenutno stanje popunjenosti prostora
  occupancy$!: Observable<OccupancyResponse>;

  ngOnInit(): void {
    // prilikom inicijalizacije komponente dohvaćamo podatke sa servera
    this.myStats$ = this.apiService.getMyCheckIns();
    this.occupancy$ = this.apiService.getOccupancy();
  }
}
