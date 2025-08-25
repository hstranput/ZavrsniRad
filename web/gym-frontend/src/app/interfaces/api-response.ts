export interface SensorReading {
  _id: string;
  sensorId: string;
  temperatura: number;
  tlak: number;
  timestamp: string; 
}

export interface LatestSensorDataResponse {
  sensor1: SensorReading | null;
  sensor2: SensorReading | null;
}

export interface OccupancyResponse {
  occupancy: number;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  status: 'unutra' | 'van';
  createdAt: string;
}
export interface MonthlyVisit {
  userName: string;
  visitCount: number;
}

export interface CheckIn {
  user: { _id: string, name: string, email: string };
  checkInTime: string;
  checkOutTime?: string;
}
export interface DailyStats {
  uniqueCount: number;
  visits: CheckIn[];
}
export interface GroupedDailyVisit {
  user: { _id: string, name: string, email: string };
  visits: CheckIn[];
  visitCount: number;
}
export interface MyCheckInsResponse {
  totalVisits: number;
  visits: CheckIn[];
}