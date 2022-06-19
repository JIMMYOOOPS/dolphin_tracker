const express = require('express')

const {
    track
} = require('../controllers/createmap_controller');

const trackRouter = express.Router();

trackRouter.get('/', track);

module.exports = {
    trackRouter
}