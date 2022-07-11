const express = require('express');
const path = require('path')
require('dotenv').config({path:__dirname+'/../../.env'});
const Data = require('../models/sightdata_model');
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
    getDataMapRouter,
    getDataDolphinRouter,
    getDownloadRouter
} = require('./sightdata_router')
const {
    createDataRouter,
    dataBasePageRouter,
    webConsoleRouter,
    userSignupRouter,
    userLoginRouter,
    usersRouter
} = require('./console_router');

api.use(`/api/${API_VERSION}/data`, getDownloadRouter, getDataAllRouter, getDataMapRouter, getDataDolphinRouter)
api.use(`/api/${API_VERSION}/tracker`, trackerRouter)
api.use(`/api/${API_VERSION}/species`, speciesRouter)

api.use('/admin/console', createDataRouter, dataBasePageRouter, webConsoleRouter, userSignupRouter, userLoginRouter, usersRouter);



module.exports = api;