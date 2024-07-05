import express from "express";
import { Server } from "socket.io";
import { createServer } from "http"
import jwt from "jsonwebtoken";

const port = 3000;

const app = express();
const server = createServer(app);

const io = new Server(server, {
   cors: {
      // origin: '*', // for all origins
      origin: 'http://localhost:5173',// for frontend origin
      methods: ['GET', 'POST'],
      credentials: true
   }

});

app.get('/', (req,res) => {
   res.send('Server is Running!')
})


io.use((socket, next) => {
   next();
})

io.on('connection', (socket) => {
   console.log('User Connected!, ', socket.id);
   socket.emit('welcome', `Welcome to the server!, ${socket.id}`);
   socket.broadcast.emit('newUser', `A new user has joined the server!, ${socket.id}`);

   socket.on('message', (data) => {
      console.log(data);
      io.to(data.rooms).emit('rmessage', {message: data.message,id : data.name});
   });

   socket.on('joinRoom', (data) => {

      socket.join(data.rooms);
      console.log(`${data.name} has joined the room ${data.rooms}`);
   });

   socket.on('disconnect', () => {
      console.log('User Disconnected!, ', socket.id);
   });
})

server.listen(port, () => {
   console.log(`Server is running at http://localhost:${port}`);
})