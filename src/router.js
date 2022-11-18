const express = require('express');
const { saveUser, getUsers, loginUser, getUser } = require('./controllers/userControler');
const { regValidator, userValidator } = require('./middleware/validator');

const mainRouter = express.Router();
mainRouter.post('/users/login', loginUser);
mainRouter.post('/users', regValidator, saveUser);
mainRouter.get('/users/:secret', getUser);
mainRouter.get('/users', getUsers);
module.exports = mainRouter;
