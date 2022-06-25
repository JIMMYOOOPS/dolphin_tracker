const _ = require('lodash');
const data = require('../models/sightdata_model');
const pageSize = 4;

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

const getDataDolphin = async (req, res) => {
    const category = req.params.category;
    const paging = parseInt(req.query.paging) || 0;
    try {
        let result = {}
        switch (category) {
            case 'all': 
                let getDataDolphin = await data.getDataDolphin(pageSize, paging)
                result = (getDataDolphin.dataCount > (paging + 1) * pageSize) ? {
                    data: getDataDolphin.data,
                    next_paging: paging + 1
                } : {
                    data: getDataDolphin.data,
                };
            case 'details': {
                const id = parseInt(req.query.id);
                if (Number.isInteger(id)) {
                    let getDataDolphin = await data.getDataDolphin(pageSize, paging, {id});
                    result = {
                        data: getDataDolphin.data,
                    };
                }
            }
        }

        res.status(200).json(result)
    } catch (err) {
        console.log(err)
        res.status(500).json(err.message)
    }
};

module.exports = {
    getDataAll,
    getDataGPS,
    getDataDolphin
}

