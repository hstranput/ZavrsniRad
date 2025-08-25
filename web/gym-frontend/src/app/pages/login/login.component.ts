import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']  
})
export class LoginComponent implements OnInit {
  // reactive forma za login
  loginForm!: FormGroup;

  // flagovi za stanje forme
  submitted = false;
  loading = false;
  errorMessage = '';

  // dependency injection
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit(): void {
    // inicijalizacija forme s validatorima
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], // mora biti email i ne smije biti prazno
      password: ['', Validators.required]                   // samo obavezno polje
    });
  }

  // getter za email polje 
  get email() {
    return this.loginForm.get('email');
  }

  // getter za lozinku
  get password() {
    return this.loginForm.get('password');
  }

  // handler kad korisnik klikne "login"
  onSubmit() {
    this.submitted = true;

    // ako forma nije validna, prekini dalje
    if (this.loginForm.invalid) {
      return;
    }

    // ako je sve u redu, pokreni login
    this.loading = true;
    this.errorMessage = '';

    // destrukturiranje vrijednosti iz forme
    const { email, password } = this.loginForm.value;

    // poziv prema AuthService za login
    this.authService.login(email, password).subscribe({
      next: () => {
        console.log('Prijava uspješna, dohvaćam podatke o korisniku...');
        
      },
      error: (err) => {
        // log greške i prikaz poruke korisniku
        console.error('Greška pri prijavi', err);
        this.errorMessage = err.error.message || 'Došlo je do greške. Pokušajte ponovno.';
        this.loading = false; // resetira loading stanje
      }
    });
  }
}
