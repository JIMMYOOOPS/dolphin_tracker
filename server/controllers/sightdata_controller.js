const _ = require('lodash');
const data = require('../models/sightdata_model');
const pageSize = 6;

const getDataAll = async (req, res) => {
    try {
        const result = await data.getDataAll()
        res.status(200).json(result)
    } catch (err) {
        console.log(err)
    }
};

const getDataGPS = async (req, res) => {
    try {
        const result = await data.getDataGPS()
        console.log

        res.status(200).json(result)
    } catch (err) {
        console.log(err)
    }
};

module.exports = {
    getDataAll,
    getDataGPS
}

