import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
//Uvoz sučelja koja opisuju strukturu podataka
import { LatestSensorDataResponse, OccupancyResponse, User, MonthlyVisit, CheckIn, MyCheckInsResponse } from '../interfaces/api-response';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);

  
  getLatestSensorData() {
    
    return this.http.get<LatestSensorDataResponse>('/api/stats/latest'); 
  }

  
  getOccupancy() {
    
    return this.http.get<OccupancyResponse>('/api/stats/occupancy');
  }

  getAllUsers() {
  
    return this.http.get<User[]>('/api/users');
  }

  deleteUser(id: string) {
  return this.http.delete(`/api/users/${id}`);
  }

  createUser(userData: any) {
    return this.http.post<User>('/api/users', userData);
  }

getDailyVisits() {
  return this.http.get<CheckIn[]>('/api/stats/daily');
}

  getMonthlyVisits() {
  return this.http.get<MonthlyVisit[]>('/api/stats/monthly-visits');
}

getMyCheckIns() {
  return this.http.get<MyCheckInsResponse>('/api/users/my-checkins');
}
// unutar api.service.ts
qrCheckIn(qrToken: string) {
    return this.http.post<any>('/api/check-in/qr', { qrToken });
}
}