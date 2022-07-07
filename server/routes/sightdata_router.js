const express = require('express');

const {
  getDataAll,
  getDataMap,
  getDataDolphin,
  getDownloadExcel
} = require('../controllers/sightdata_controller');

const getDataAllRouter = express.Router();
const getDataMapRouter = express.Router();
const getDataDolphinRouter = express.Router();
const getDownloadExcelRouter = express.Router()

getDataAllRouter.get('/:category', getDataAll);
getDataMapRouter.get('/map/:category', getDataMap);
getDataMapRouter.post('/map/:category', getDataMap);
getDataDolphinRouter.get('/dolphins/:category', getDataDolphin);
getDownloadExcelRouter.get('/download', getDownloadExcel)

module.exports = {
  getDataAllRouter,
  getDataMapRouter,
  getDataDolphinRouter,
  getDownloadExcelRouter
};
