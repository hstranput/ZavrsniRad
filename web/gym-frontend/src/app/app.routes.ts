import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { UserDashboardComponent } from './pages/user-dashboard/user-dashboard.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { authGuard } from './guards/auth.guard'; 
import { AdminStatsComponent } from './pages/admin-stats/admin-stats.component';
import { QrDisplayComponent } from './pages/qr-display/qr-display.component';
import { CheckInComponent } from './pages/check-in/check-in.component';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },

   
    { 
      path: 'dashboard', 
      component: UserDashboardComponent, 
      canActivate: [authGuard] 
    },
    { 
      path: 'admin/dashboard', 
      component: AdminDashboardComponent, 
      canActivate: [authGuard]
    },
    { 
      path: 'admin/stats', 
      component: AdminStatsComponent, 
      canActivate: [authGuard]
    },
    { path: 'display-qr', component: QrDisplayComponent, canActivate: [authGuard] },
    { path: 'check-in', component: CheckInComponent, canActivate: [authGuard] },
    { path: '**', component: NotFoundComponent }
];