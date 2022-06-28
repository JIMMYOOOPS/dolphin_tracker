const express = require('express');

const {
  createData,
  getDataAll,
  getDataMap,
  getDataDolphin
} = require('../controllers/sightdata_controller');

const createDataRouter = express.Router();
const getDataAllRouter = express.Router();
const getDataMapRouter = express.Router();
const getDataDolphinRouter = express.Router();

getDataAllRouter.get('/all', getDataAll);
createDataRouter.post('/all', createData);
getDataMapRouter.get('/map/:category', getDataMap);
getDataMapRouter.post('/map/:category', getDataMap);
getDataDolphinRouter.get('/dolphins/:category', getDataDolphin);

module.exports = {
  createDataRouter,
  getDataAllRouter,
  getDataMapRouter,
  getDataDolphinRouter
};
