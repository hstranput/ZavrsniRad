import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;

  constructor() {
    
    this.socket = io('http://localhost:3000');
  }

  
  listen<T>(eventName: string): Observable<T> {
    return new Observable(subscriber => {
      this.socket.on(eventName, (data: T) => {
        subscriber.next(data);
      });
    });
  }

  
  getSocket() {
    return this.socket;
  }
}