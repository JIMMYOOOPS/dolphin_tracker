const express = require('express');
const path = require('path')
require('dotenv').config({path:__dirname+'/../../.env'});
const { API_VERSION } = process.env 

const api = express.Router();

const {
    trackerRouter
} = require('./tracker_router')
const {
    speciesRouter
} = require('./species_router')
const {
    getDataAllRouter,
    getDataGPSRouter
} = require('./sightdata_router')


api.use(`/${API_VERSION}/tracker`, trackerRouter)
api.use(`/${API_VERSION}/species`, speciesRouter)
api.use(`/${API_VERSION}/data`, getDataAllRouter, getDataGPSRouter)


module.exports = api;