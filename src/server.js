/* eslint-disable no-unused-vars */
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const colors = require('colors');
const cors = require('cors');

const testDbConnection = require('./utils/helper');
const mainRouter = require('./router');

const app = express();
const { PORT } = process.env;
// MiddleWare
app.use(morgan('dev'));
app.use(cors());
// kad gautame request.body galetume matyti JSON atsiųstus duomenis turim įjungti JSON atkodavimą;
app.use(express.json());

// TEST DB CONNECTION
testDbConnection();
// ROUTES

app.get('/', (req, res) => res.json({ msg: 'server online' }));

app.use('/api', mainRouter);

app.use((req, res) => {
  res.status(404).json({ msg: 'Not found' });
});

app.listen(PORT, () => console.log(`Server is listening to port: ${PORT}`.cyan.bold));
