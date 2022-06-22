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
        
        let result = {}
        result = {
            data: await data.getDataGPS()
        }
        result["data"].forEach(e => {
            // GPS convertt for 1998 - 2020
            if (e.latitude < 23 || e.longitude < 121)  {
                e.latitude = null;
                e.latitude_min = null;
                e.latitude_sec = null;
                e.longitude = null;
                e.longitude_min = null;
                e.longitude_sec = null;
            } else {
                e.latitude = e.latitude + (e.latitude_min + e.latitude_sec/1000)/60;
                e.longitude = e.longitude + (e.longitude_min + e.longitude_sec/1000)/60;
            }
            // GPS convert for 2021 to now
            // e.latitude_min = e.latitude_min/60;
            // e.latitude_sec = e.latitude_sec/3600;
            // e.latitude = e.latitude + e.latitude_min + e.latitude_sec;
            // e.longitude_min = e.longitude_min/60;
            // e.longitude_sec = e.longitude_sec/3600;
            // e.longitude = e.longitude + e.longitude_min + e.longitude_sec;
            
        })
        res.status(200).json(result)
    } catch (err) {
        console.log(err)
        res.status(500).json(err.message)
    }
};

module.exports = {
    getDataAll,
    getDataGPS
}

