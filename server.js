import * as express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const port = 8000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }))

app.set('port', port);

const server = createServer(app);

const io = new Server(server);

server.listen(port);

server.listen(port);
