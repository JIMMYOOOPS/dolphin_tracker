const express = require('express');

const {
  getDataAll,
  getDataMap,
  getDataDolphin,
  getDownload
} = require('../controllers/sightdata_controller');

const getDataAllRouter = express.Router();
const getDataMapRouter = express.Router();
const getDataDolphinRouter = express.Router();
const getDownloadRouter = express.Router();

getDataAllRouter.get('/:category', getDataAll);
getDataMapRouter.get('/map/:category', getDataMap);
getDataMapRouter.post('/map/:category', getDataMap);
getDataDolphinRouter.get('/dolphins/:category', getDataDolphin);
getDownloadRouter.get('/download', getDownload);


module.exports = {
  getDataAllRouter,
  getDataMapRouter,
  getDataDolphinRouter,
  getDownloadRouter
};
