import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { Server } from 'socket.io';
import http from 'http';

dotenv.config({
  path: './.env',
});

const app = express();
app.use(cors({
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST'],
  credentials: true,
}));

app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {   
    origin: 'http://localhost:5173',
    credentials: true, 
  },
});

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  
  socket.on('send-message', (message) => {
    console.log('recivedmessage:', message);
    io.emit('message', message); 
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
}); 

const PORT = process.env.PORT || 4001;

app.get('/', (req, res) => {
  res.send('Server is running');
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
