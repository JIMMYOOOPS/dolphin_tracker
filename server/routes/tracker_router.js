const express = require('express');

const {
  tracker,
} = require('../controllers/tracker_controller');

const trackerRouter = express.Router();

trackerRouter.get('/', tracker);

module.exports = {
  trackerRouter,
};
