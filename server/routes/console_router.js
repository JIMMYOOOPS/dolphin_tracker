const express = require('express');

const {
    webConsole,
    webConsolePage,
    userSignup,
    userLogin
} = require('../controllers/console_controller');

const webConsoleRouter = express.Router();
const webConsolePageRouter = express.Router();
const userSignupRouter = express.Router();
const userLoginRouter = express.Router();

webConsoleRouter.get('/', webConsole);
webConsolePageRouter.get('/login', webConsolePage);
userSignupRouter.post('/signup', userSignup);
userLoginRouter.post('/login', userLogin);

module.exports = {
    webConsoleRouter,
    webConsolePageRouter,
    userSignupRouter,
    userLoginRouter
}