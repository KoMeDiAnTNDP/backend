const express = require('express');
const http = require('http');
const io = require('socket.io');
const admin = require('firebase-admin');
const firebaseKeys = require('./keys/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(firebaseKeys),
});

const port = 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }))

app.set('port', port);

const server = http.createServer(app);

const ioServer = new io.Server(server);

ioServer.on('connection', async socket => {
  const token = socket.handshake.headers.authorization.split(' ')[1];
  const verifiedToken = await admin.auth().verifyIdToken(token);

  socket.broadcast.emit('user_connected', { id: verifiedToken.uid, email: verifiedToken.email })

  socket.on('user_disconnected', user => socket.broadcast.emit('user_disconnected', user));

  socket.on('send_message', message => socket.broadcast.emit('received_message', message));

  socket.on('typing', data => socket.broadcast.emit('typing', data));

  socket.on('stop_typing', data => socket.broadcast.emit('stop_typing', data));
});

server.listen(port, err => {
  if (err) throw err;

  console.log(`Listening on port ${port}`)
});

