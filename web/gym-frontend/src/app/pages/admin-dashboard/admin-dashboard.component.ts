import { Component, OnInit, inject } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { LatestSensorDataResponse, OccupancyResponse, User } from '../../interfaces/api-response';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddUserFormComponent } from '../../components/add-user-form/add-user-form.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, AddUserFormComponent, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit { 
  private apiService = inject(ApiService); 
  private modalService = inject(NgbModal); 

  // podaci sa senzora i o popunjenosti (observable jer se stalno mijenjaju)
  sensorData$!: Observable<LatestSensorDataResponse>;
  occupancy$!: Observable<OccupancyResponse>;

  // lista korisnika
  allUsers: User[] = [];
  filteredUsers: User[] = []; 
  searchTerm: string = ''; 

  // dohvati podatke na loadu (senzori i popunjenost)
  ngOnInit(): void { 
    this.sensorData$ = this.apiService.getLatestSensorData(); 
    this.occupancy$ = this.apiService.getOccupancy();
    
    this.loadUsers(); // ucitati listu korisnika
  }

  // dohvati korisnike iz API-ja
  loadUsers(): void {
    this.apiService.getAllUsers().subscribe(users => { 
      this.allUsers = users;
      this.filteredUsers = users; 
    });
  }

  // filtriraj korisnike prema imenu case-insensitive
  onSearchChange(): void {
    const searchTermLower = this.searchTerm.toLowerCase(); 
    if (!searchTermLower) {
      this.filteredUsers = this.allUsers; 
    } else {
      
      this.filteredUsers = this.allUsers.filter(user =>  
        user.name.toLowerCase().includes(searchTermLower) 
      );
    }
  }

  // brisanje korisnika s potvrdom
  deleteUser(id: string, name: string): void {
    if (confirm(`Jeste li sigurni da želite obrisati korisnika ${name}?`)) {
      this.apiService.deleteUser(id).subscribe({
        next: () => {
          alert('Korisnik uspješno obrisan.');
          this.loadUsers(); 
        },
        error: (err) => {
          console.error('Greška pri brisanju korisnika', err);
          alert('Došlo je do greške.');
        }
      });
    }
  }

  // otvori modal za dodavanje korisnika
  openAddUserModal(): void {
    const modalRef = this.modalService.open(AddUserFormComponent);
    modalRef.componentInstance.userAdded.subscribe(() => {
      this.loadUsers(); 
    });
  }
}