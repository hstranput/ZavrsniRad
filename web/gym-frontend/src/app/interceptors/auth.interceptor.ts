import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

// intercepta odlane HTTP zahtjeve kako bi dodao JWT token (ako postoji)
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  // dohvati token iz servicea (moze biti null ako nije logiran)
  const token = authService.getToken();

  if (token) {
    // kloniranje zahtjeva s auth headerom
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    
    // console.log("Interceptan zahtjev s tokenom:", authReq);

    return next(authReq);
  }

  // nema tokena, šalji izvorni zahtjev
 
  return next(req);
};
