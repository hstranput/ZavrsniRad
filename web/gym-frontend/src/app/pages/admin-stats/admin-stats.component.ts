import { Component, OnInit, inject } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CheckIn, MonthlyVisit, GroupedDailyVisit } from '../../interfaces/api-response';

@Component({
  selector: 'app-admin-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-stats.component.html',
  styleUrls: ['./admin-stats.component.scss'] 
})
export class AdminStatsComponent implements OnInit {
  private apiService = inject(ApiService);
  
  // observable za grupirane posjete po korisnicima (dnevno)
  dailyGroupedVisits$!: Observable<GroupedDailyVisit[]>;

  // broj jedinstvenih korisnika u jednom danu
  dailyUniqueCount$!: Observable<number>;

  // mjesečni podaci o posjetima
  monthlyVisits$!: Observable<MonthlyVisit[]>;

  // koji korisnik je trenutno expandiran u UI
  public expandedUserId: string | null = null;

  ngOnInit(): void {
    // dohvat svih dnevnih posjeta sa servera
    const dailyVisits$ = this.apiService.getDailyVisits();

    // broj jedinstvenih korisnika u danu
    this.dailyUniqueCount$ = dailyVisits$.pipe(
      map(visits => {
        // filtrirati samo posjete koji imaju usera (za svaki slučaj)
        const validVisits = visits.filter(v => v.user);

        // Set koristi da makne duplikate po user._id
        return new Set(validVisits.map(v => v.user._id)).size;
      })
    );

    // grupiranje posjeta po korisnicima
    this.dailyGroupedVisits$ = dailyVisits$.pipe(
      map(visits => {
        const grouped = new Map<string, GroupedDailyVisit>();

        for (const visit of visits) {
          if (!visit.user) {
            continue; // ako nema usera onda preskoci
          }

          const userId = visit.user._id;

          // ako prvi put nalazimo usera, inicijaliziraj objekt
          if (!grouped.has(userId)) {
            grouped.set(userId, { user: visit.user, visits: [], visitCount: 0 });
          }

          // dodati posjet u grupu i povecati brojac
          const userData = grouped.get(userId)!;
          userData.visits.push(visit);
          userData.visitCount++;
        }

        // vrati kao array
        return Array.from(grouped.values());
      })
    );
    
    // dohvat mjesečnih posjeta
    this.monthlyVisits$ = this.apiService.getMonthlyVisits();
  }

  // helper za otvaranje/zatvaranje detalja korisnika
  toggleVisits(userId: string): void {
    if (this.expandedUserId === userId) {
      this.expandedUserId = null;   // klik na istog usera, zatvori
    } else {
      this.expandedUserId = userId; // klik na drugog usera, otvori njega
    }
  }
}
