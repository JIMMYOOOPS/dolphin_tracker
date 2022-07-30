const express = require('express');

const {
  species,
} = require('../controllers/species_controller');

const speciesRouter = express.Router();

speciesRouter.get('/:category', species);

module.exports = {
  speciesRouter,
};
