import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, tap, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../interfaces/api-response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private tokenKey = 'authToken'; // kljuc pod kojim spremamo token u localStorage

  // BehaviorSubject nam omogućuje da spremimo trenutno prijavljenog korisnika
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable(); // Observable koji komponente mogu pratiti

  constructor() {}

  // metoda za prijavu korisnika
  login(email: string, password: string) {
    return this.http.post<any>('/api/auth/login', { email, password }).pipe(
      tap(response => {
        // sprema token nakon uspjesne prijave
        this.saveToken(response.token);
        // dohvaca podatke o korisniku
        this.getMe().subscribe();
      })
    );
  }

  // dohvaca trenutno prijavljenog korisnika
  getMe() {
    return this.http.get<User>('/api/auth/me').pipe(
      tap(user => {
        this.userSubject.next(user); // sprema korisnika u BehaviorSubject

        // ako smo trenutno na login stranici, radimo preusmjeravanje
        if (this.router.url === '/login') {
          if (user.role === 'admin') {
            this.router.navigate(['/admin/dashboard']); // admin ide na admin dashboard
          } else {
            this.router.navigate(['/dashboard']); // obican korisnik ide na svoj dashboard
          }
        }
      })
    );
  }

  // koristi se pri pokretanju aplikacije za provjeru je li korisnik već prijavljen
  loadInitialUser(): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return of(null); // ako nema tokena, vratiti null
    }

    // ako token postoji, pokusati dohvatiti korisnika
    return this.getMe().pipe(
      catchError(() => {
        // ako token više nije valjan, odjaviti korisnika
        this.logout();
        return of(null);
      })
    );
  }

  // spremanje tokena u localStorage
  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  // dohvacanje tokena iz localStorage
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // odjava korisnika
  logout(): void {
    localStorage.removeItem(this.tokenKey); // brise token
    this.userSubject.next(null); // brise korisnika iz memorije
    this.router.navigate(['/login']); // preusmjerava na login
  }
}
