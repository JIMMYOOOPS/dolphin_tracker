const express = require('express');

const {
  getDataAll,
  getDataGPS,
  getDataDolphin
} = require('../controllers/sightdata_controller');

const getDataAllRouter = express.Router();
const getDataGPSRouter = express.Router();
const getDataDolphinRouter = express.Router();

getDataAllRouter.get('/all', getDataAll);
getDataGPSRouter.get('/gps', getDataGPS);
getDataDolphinRouter.get('/dolphins/:category', getDataDolphin);

module.exports = {
  getDataAllRouter,
  getDataGPSRouter,
  getDataDolphinRouter
};
