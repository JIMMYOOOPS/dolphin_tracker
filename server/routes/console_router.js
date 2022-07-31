const express = require('express');
const {upload, authentication, testAccountAuthenticate} = require('../../utils/util');
const {USER_ROLE} =require('../models/console_model');

const cdUpload = upload.fields([
  {name: 'main_image', maxCount: 1},
  {name: 'other_images', maxCount: 3},
]);

const {
  dataBasePage,
  sightingPage,
  webConsole,
  webConsolePage,
  userSignup,
  userLogin,
  getUsers,
  updateUsers,
  validateUserLogin,
  deleteUsers,
} = require('../controllers/console_controller');

const {
  createData,
  updateData,
} = require('../controllers/sightdata_controller');

const createDataRouter = express.Router();
const dataBasePageRouter = express.Router();
const webConsoleRouter = express.Router();
const userSignupRouter = express.Router();
const userLoginRouter = express.Router();
const usersRouter = express.Router();

createDataRouter.post('/sighting', cdUpload, createData);
createDataRouter.get('/sighting', authentication(USER_ROLE.RECORDERS), sightingPage);
dataBasePageRouter.get('/database', authentication(USER_ROLE.KUROSHIO), dataBasePage);
dataBasePageRouter.put('/database', updateData);
usersRouter.get('/users', authentication(USER_ROLE.ADMIN), getUsers);
usersRouter.put('/users', authentication(USER_ROLE.ADMIN), testAccountAuthenticate(), updateUsers);
usersRouter.delete('/users', authentication(USER_ROLE.ADMIN), testAccountAuthenticate(), deleteUsers);
usersRouter.get('/users/login', validateUserLogin);
webConsoleRouter.get('/', webConsole);
userLoginRouter.get('/login', webConsolePage);
userLoginRouter.post('/login', userLogin);
userSignupRouter.post('/signup', userSignup);


module.exports = {
  createDataRouter,
  dataBasePageRouter,
  webConsoleRouter,
  userSignupRouter,
  userLoginRouter,
  usersRouter,
};
