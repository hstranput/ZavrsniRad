import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// zastita ruta
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService); // dohvati AuthService (koristi sve vezano s autentifikacijom)
  const router = inject(Router); // dohvati Router (za navigaciju)

  
  const token = authService.getToken(); // provjeri postoji li token

  if (token) {
    return true; // ako postoji token, dozvoli pristup ruti
  }

  
  router.navigate(['/login']); // ako nema tokena, preusmjeri na login
  return false; // zabrani pristup ruti
};