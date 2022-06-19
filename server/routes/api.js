const express = require('express');
const path = require('path')
require('dotenv').config({path:__dirname+'/../../.env'});
const { API_VERSION } = process.env 

const api = express.Router();

const {
    trackRouter
} = require('./createmap_router')
const {
    getDataAllRouter,
    getDataGPSRouter
} = require('./sightdata_router')

api.use(`/${API_VERSION}/track`, trackRouter)
api.use(`/${API_VERSION}/data`, getDataAllRouter, getDataGPSRouter)

module.exports = api;