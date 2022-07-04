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
    getDataMapRouter,
    getDataDolphinRouter
} = require('./sightdata_router')
const {
    createDataRouter,
    dataBasePageRouter,
    webConsoleRouter,
    webConsolePageRouter,
    userSignupRouter,
    userLoginRouter,
    usersPageRouter
} = require('./console_router')

api.use(`/api/${API_VERSION}/data`,  getDataAllRouter, getDataMapRouter, getDataDolphinRouter)
api.use(`/api/${API_VERSION}/tracker`, trackerRouter)
api.use(`/api/${API_VERSION}/species`, speciesRouter)

api.use('/admin/console', createDataRouter, dataBasePageRouter, webConsoleRouter, webConsolePageRouter, userSignupRouter, userLoginRouter, usersPageRouter);

module.exports = api;