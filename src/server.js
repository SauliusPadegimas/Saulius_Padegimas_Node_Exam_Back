/* eslint-disable no-unused-vars */
require('dotenv').config();
const express = require('express');

const app = express();
const morgan = require('morgan');
const colors = require('colors');
const cors = require('cors');
const http = require('http').createServer(app);
const socketIo = require('socket.io');
const testDbConnection = require('./utils/helper');
const restRouter = require('./routers/restRouter');
const socketRouter = require('./routers/socketRouter');

const { PORT } = process.env;
// MiddleWare
const io = socketIo(http, {
  cors: {
    origin: 'http://localhost:3000',
  },
});
app.use(morgan('dev'));
app.use(cors());
// kad gautame request.body galetume matyti JSON atsiųstus duomenis turim įjungti JSON atkodavimą;
app.use(express.json());

// TEST DB CONNECTION
testDbConnection();
// ROUTES

app.get('/', (req, res) => res.json({ msg: 'server online' }));

app.use('/api/users', restRouter);

app.use((req, res) => {
  res.status(404).json({ msg: 'Not found' });
});
app.set('socketio', io);

http.listen(PORT, () => console.log(`Server is listening to port: ${PORT}`.cyan.bold));

socketRouter(io);
