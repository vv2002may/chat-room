import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { Button, Container, Stack, TextField, Typography } from "@mui/material";
import './App.css';

const ENDPOINT = "http://localhost:3000";//server address

const App = () => {

  const socket = useMemo(() => io(ENDPOINT), []);
  const [message, setMessage] = useState('');
  const [room, setRoom] = useState('');
  const [socketID, setSocketID] = useState('');
  const [user, setUser] = useState([]);
  const [messages, setMessages] = useState([]);
  const [rooms, setRooms] = useState("");
  const [name, setName] = useState("");
  // console.log(messages);

  const joinRoomHandler = (e) => {
    e.preventDefault();
    socket.emit('joinRoom', { name, rooms });
    setRooms('');
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit('message', { message, room, name });
    setMessage('');
  }

  useEffect(() => {
    socket.on('connect', () => {
      setSocketID(socket.id);
      console.log('Connected to server!\n', socket.id);
    });

    socket.on('welcome', (data) => {
      console.log(data);
    });

    socket.on('newUser', (data) => {
      console.log(data);
    });

    socket.on('rmessage', (data) => {
      console.log(data);
      setMessages((messages) => [...messages, data.message]);
      setUser((user) => [...user, data]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Container
      style={{ marginTop: '2vmax' }}
    >

      <Typography variant="h4" textAlign={'center'} component='div' gutterBottom>
      </Typography>

      <div className="container">
        <div className="C0">
          {
            // rooms
          }
        </div>
        <div className="C1">
          <form onSubmit={joinRoomHandler} style={{ margin: '3vmax' }}>
            <TextField
              value={name}
              onChange={(e) => { setName(e.target.value) }}
              id="outlined-basic"
              label="Name"
              variant="outlined"
              style={{ margin: '1vmax' }}
              required
              fullWidth />
            <TextField
              value={rooms}
              onChange={(e) => { setRooms(e.target.value) }}
              id="outlined-basic"
              label="Room"
              variant="outlined"
              style={{ margin: '1vmax' }}
              required
              fullWidth />

            <Button style={{ margin: '1vmax' }} type="submit" variant="contained" color="primary" fullWidth>
              Send
            </Button>
          </form>

          <form onSubmit={handleSubmit} style={{ margin: '3vmax' }}>
            <TextField
              value={message}
              onChange={(e) => { setMessage(e.target.value) }}
              id="outlined-basic"
              label="Message"
              variant="outlined"
              required
              style={{ margin: '1vmax' }}
              fullWidth />

            <TextField
              value={room}
              onChange={(e) => { setRoom(e.target.value) }}
              id="outlined-basic"
              label="Room"
              variant="outlined"
              style={{ margin: '1vmax' }}
              required
              fullWidth />

            <Button style={{ margin: '1vmax' }} type="submit" variant="contained" color="primary" fullWidth>Send</Button>
          </form>
        </div>
        <div className="C2">
          <h2>Messages</h2>
          <div className="messages">
            {
              user.map((m, i) => (
                <h3>{m.id}:<span>{m.message}</span><hr /></h3>
              ))
            }
          </div>
        </div>
      </div>

    </Container>
  )
}

export default App
