import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { SocketService } from '../../services/socket.service';
import { CommonModule } from '@angular/common';
import { QRCodeComponent } from 'angularx-qrcode'; 

@Component({
  selector: 'app-qr-display',
  standalone: true,
  imports: [CommonModule, QRCodeComponent], 
  templateUrl: './qr-display.component.html',
  styleUrls: ['./qr-display.component.scss']   
})

export class QrDisplayComponent implements OnInit, OnDestroy {
  private socketService = inject(SocketService);
  public qrCodeValue: string = 'Učitavanje...'; // početna vrijednost QR koda dok ne stigne token
  private socket: any;  // ovdje spremiti referencu na socket

  ngOnInit(): void {
    // dohvat socket instance preko servisa
    this.socket = this.socketService.getSocket();

    // slati event serveru kako bi se priljucio u sobu za display QR kodova
    this.socket.emit('join_display_room');

    // slusati novi token od servera i kada stigne, azurirati QR kod
    this.socket.on('new_qr_token', (token: string) => {
      this.qrCodeValue = token;
    });
  }

  ngOnDestroy(): void {
    // kad se komponeenta unisti, maknuti listener
    this.socket.off('new_qr_token');
  }
}
