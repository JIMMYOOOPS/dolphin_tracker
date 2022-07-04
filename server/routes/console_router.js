const express = require('express');
const { upload, authentication } = require('../../utils/util');
const { USER_ROLE } =require('../models/console_model')

const cdUpload = upload.fields([
    { name: 'main_image', maxCount: 1 },
    { name: 'other_images', maxCount: 3 }
]);

const {
    dataBasePage,
    sightingPage,
    webConsole,
    webConsolePage,
    userSignup,
    userLogin,
    getUsersPage
} = require('../controllers/console_controller');

const {
    createData,
    updateData,
    deleteData
  } = require('../controllers/sightdata_controller');

const createDataRouter = express.Router();
const dataBasePageRouter = express.Router();
const webConsoleRouter = express.Router();
const webConsolePageRouter = express.Router();
const userSignupRouter = express.Router();
const userLoginRouter = express.Router();
const usersPageRouter = express.Router();


createDataRouter.post('/sighting', cdUpload, createData);
createDataRouter.get('/sighting', authentication(USER_ROLE.RECORDERS), sightingPage);
dataBasePageRouter.get('/database', authentication(USER_ROLE.KUROSHIO), dataBasePage);
dataBasePageRouter.put('/database', updateData);
// dataBasePageRouter.delete('/database', deleteData);
usersPageRouter.get('/users', authentication(USER_ROLE.ADMIN), getUsersPage);
webConsoleRouter.get('/', webConsole);
webConsolePageRouter.get('/login', webConsolePage);
userSignupRouter.post('/signup', userSignup);
userLoginRouter.post('/login', userLogin);

module.exports = {
    createDataRouter,
    dataBasePageRouter,
    webConsoleRouter,
    webConsolePageRouter,
    userSignupRouter,
    userLoginRouter,
    usersPageRouter
}