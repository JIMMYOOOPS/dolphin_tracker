const express = require('express')

const {
    console,
    consoleLogin
} = require('../controllers/console_controller');

const consoleRouter = express.Router();
const consoleLoginRouter = express.Router();

consoleRouter.get('/console', console);
consoleLoginRouter.get('/console/login', consoleLogin);

module.exports = {
    consoleRouter,
    consoleLoginRouter
}