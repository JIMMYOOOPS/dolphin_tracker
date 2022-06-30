const express = require('express');

const {
  getDataAll,
  getDataMap,
  getDataDolphin
} = require('../controllers/sightdata_controller');

const getDataAllRouter = express.Router();
const getDataMapRouter = express.Router();
const getDataDolphinRouter = express.Router();

getDataAllRouter.get('/all', getDataAll);
getDataMapRouter.get('/map/:category', getDataMap);
getDataMapRouter.post('/map/:category', getDataMap);
getDataDolphinRouter.get('/dolphins/:category', getDataDolphin);

module.exports = {
  getDataAllRouter,
  getDataMapRouter,
  getDataDolphinRouter
};
