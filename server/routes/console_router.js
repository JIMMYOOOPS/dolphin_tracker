const express = require('express');
const {upload} = require('../../utils/util');

const cdUpload = upload.fields([
    { name: 'main_image', maxCount: 1 },
    { name: 'other_images', maxCount: 12 }
]);


const {
    webConsole,
    webConsolePage,
    userSignup,
    userLogin
} = require('../controllers/console_controller');

const {
    createData
  } = require('../controllers/sightdata_controller');

const createDataRouter = express.Router();
const webConsoleRouter = express.Router();
const webConsolePageRouter = express.Router();
const userSignupRouter = express.Router();
const userLoginRouter = express.Router();

createDataRouter.post('/sighting', cdUpload, createData);
webConsoleRouter.get('/', webConsole);
webConsolePageRouter.get('/login', webConsolePage);
userSignupRouter.post('/signup', userSignup);
userLoginRouter.post('/login', userLogin);

module.exports = {
    createDataRouter,
    webConsoleRouter,
    webConsolePageRouter,
    userSignupRouter,
    userLoginRouter
}