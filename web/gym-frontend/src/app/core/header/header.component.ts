import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FirstNamePipe } from '../../pipes/first-name.pipe';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap'; 


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, FirstNamePipe, NgbCollapseModule], 
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
// logika za header
export class HeaderComponent { 
  authService = inject(AuthService); 
  public isMenuCollapsed = true;  

  logout(): void { 
    this.authService.logout(); 
  }
}