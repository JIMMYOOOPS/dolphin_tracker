const express = require('express')

const {
    getDataAll,
    getDataGPS
} = require('../controllers/sightdata_controller');

const getDataAllRouter = express.Router();
const getDataGPSRouter = express.Router();

getDataAllRouter.get('/all', getDataAll);
getDataGPSRouter.get('/gps', getDataGPS);

module.exports = {
    getDataAllRouter,
    getDataGPSRouter
}