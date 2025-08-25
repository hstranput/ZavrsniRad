const express = require('express');
const cors = require('cors');
const http = require('http'); 
const { Server } = require("socket.io"); 
const connectDB = require('./config/db');
const startMqttListener = require('./services/mqttListener');
const qrTokenService = require('./services/qrTokenService');
require('dotenv').config();

const app = express(); 
const server = http.createServer(app); 


const io = new Server(server, { 
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});


connectDB();


startMqttListener(io); // prosljeđuje se io da se može emitati iz mqttListenera

// generiranje novog QR tokena svakih 15 sekundi 
setInterval(() => qrTokenService.generateNewToken(io), 15000);


app.use(cors());
app.use(express.json());


app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/check-in', require('./routes/checkIn'));
app.use('/api/stats', require('./routes/stats'));


io.on('connection', (socket) => { //kad se netko spoji na websocket
  console.log('Novi klijent spojen:', socket.id); // socket.id je jedinstveni ID za svakog klijenta
  
  socket.on('join_display_room', () => { // kad klijent zatraži pridruživanje sobi za display
      socket.join('display_clients_room'); // pridruži se sobi
      socket.emit('new_qr_token', qrTokenService.getActiveToken()); // pošalji trenutni QR token
  });

  socket.on('disconnect', () => { // kad se klijent odspoji
    console.log('Klijent odspojen:', socket.id);  // logiraj odspajanje
  });
});

const PORT = process.env.PORT || 3000; 

server.listen(PORT, () => console.log(`Server started on port ${PORT}`));