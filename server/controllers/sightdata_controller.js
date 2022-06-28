const _ = require('lodash');
const Data = require('../models/sightdata_model');
const pageSize = 4;

const createData = async (req, res) => {
    try {
        const data = req.body;
        // For table sailing_info
        const sailingInfoData = {
            sailing_id: data.sailing_id,
            sighting_id: data.sighting_id,
            mix: data.mix,
            year: data.year,
            month: data.month,
            day: data.day,
            period: data.period,
            arrival: data.arrival,
            departure: data.departure,
            boat_size: data.boat_size,
            gps_no: data.gps_no,
            guide: data.guide,
            recorder: data.recorder,
            sighting: data.sighting,
            observations: data.observations,
            weather: data.weather,
            wind_direction: data.wind_direction,
            wave_condition: data.wave_condition,
            current: data.current
        }
        // For table obv_GPS
        const obvGPS = {
            latitude: data.latitude,
            latitude_min: data.latitude_min,
            latitude_sec: data.latitude_sec,
            longitude: data.longitude,
            longitude_min: data.longitude_min,
            longitude_sec: data.longitude_sec
        }
        // For table obv_approach
        const obvApproach = {
            approach_time: data.approach_time,
            approach_gps_no: data.approach_gps_no,
            leaving_time: data.leaving_time,
            leaving_gps_no: data.leaving_gps_no,
            leaving_method: data.leaving_method
        }
        // For table obv_detail
        const obvDetail = {
            sighting_method: data.sighting_method,
            dolphin_type: data.dolphin_type,
            type_confirmation: data.type_confirmation,
            dolphin_group_no: data.dolphin_group_no,
            dolphin_type_no: data.dolphin_type_no,
            dorsal_fin: data.dorsal_fin,
            exhalation: data.exhalation,
            splash: data.splash,
            exhibition: data.exhibition,
            mother_child: data.mother_child, 
            mother_child_no:  data.mother_child_no,
            group_size_lowest: data.group_size_lowest,
            group_size_probable: data.group_size_probable,
            group_size_highest: data.group_size_highest,
            mix: data.mix,
            mix_type: data.mix_type
        }
        // For table obv_interaction
        const obvInteraction = {
            time: data.time,
            boat_interaction: data.boat_interaction,
            boat_distance: data.boat_distance,
            group_closeness_normal: data.group_closeness_normal,
            group_closeness_spreaded: data.group_closeness_spreaded,
            group_closeness_close: data.group_closeness_close,
            speed_slow: data.speed_slow,
            speed_moderate: data.speed_moderate,
            speed_fast: data.speed_fast,
            speed_resting: data.speed_resting,
            speed_circling: data.speed_circling,
            foraging_maybe: data.foraging_maybe,
            foraging_sure: data.foraging_sure,
            mating: data.mating,
            splash_interaction: data.splash,
            snorkel: data.snorkel,
            racing: data.racing,
            jump: data.jump,
            surfing_artificial: data.surfing_artificial,
            surfing: data.surfing,
            tail_lift: data.tail_lift,
            contact: data.contact,
            backstroke: data.backstroke,
            boat_no: data.boat_no,
            other: data.other
        }
        // For table pic
        const pic = {
            pic: data.pic
        }

        //Recieved POST from body next step insert to DB

        let result = {
            sailing_info: sailingInfoData,
            obv_GPS: obvGPS,
            obv_approach: obvApproach,
            obv_detail: obvDetail,
            obv_interaction: obvInteraction,
            pic: pic
        }

        res.status(200).json(result)
    } catch (error) {
        console.log(error)
    }
}

const getDataAll = async (req, res) => {
    try {
        const result = await data.getDataAll()
        res.status(200).json(result)
    } catch (error) {
        console.log(error)
    }
};

const getDataMap = async (req, res) => {
    try {
        const category = req.params.category;
        async function findSightData(category) {
            switch (category) {
                case 'all':
                    return Data.getDataMap()
                case 'date': {
                    const range = req.body.range.split('. ')
                    const type = req.body.type
                    console.log(range)
                    console.log(type)
                    if (range && type) {
                        const [startYear, startMonth, startDay, rawEndYear, endMonth, rawEndDay] = range;
                        let endDayArr = rawEndDay.split('.')
                        let endDay = endDayArr[0]
                        let endYearArr = rawEndYear.split('- ');
                        let endYear = endYearArr[1]
                        let startDate =  startYear + startMonth + startDay
                        let endDate = endYear + endMonth + endDay
                        return await Data.getDataMap(null, null, {startDate, endDate, type});
                    } else if (range) {
                        const [startYear, startMonth, startDay, rawEndYear, endMonth, rawEndDay] = range;
                        let endDayArr = rawEndDay.split('.')
                        let endDay = endDayArr[0]
                        let endYearArr = rawEndYear.split('- ');
                        let endYear = endYearArr[1]
                        let startDate =  startYear + startMonth + startDay
                        let endDate = endYear + endMonth + endDay
                        return await Data.getDataMap(null, null, {startDate, endDate});
                    }
                    // if(Number.isInteger(day)) {
                    //     console.log('here1', year, month, day)
                    //     return await Data.getDataMap(null, null, {year, month, day});
                    // } else if (Number.isInteger(month)) {
                    //     console.log('here2', year, month)
                    //     return await Data.getDataMap(null, null, {year, month})
                    // } else {
                    //     console.log('here3', year)
                    //     return await Data.getDataMap(null, null, {year})
                    // }
                }
                case 'type': {
                    const type = req.body.type;
                    return await Data.getDataMap(null, null, {type});
                }
            }
        }
        let result = {}
        result = {
            data: await findSightData(category)
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
    } catch (error) {
        console.log(error)
        res.status(500).json(error.message)
    }
};

const getDataDolphin = async (req, res) => {
    const category = req.params.category;
    const paging = parseInt(req.query.paging) || 0;
    try {
        let result = {}
        switch (category) {
            case 'all': 
                let getDataDolphin = await Data.getDataDolphin(pageSize, paging)
                result = (getDataDolphin.dataCount > (paging + 1) * pageSize) ? {
                    data: getDataDolphin.data,
                    next_paging: paging + 1
                } : {
                    data: getDataDolphin.data,
                };
            case 'details': {
                const id = parseInt(req.query.id);
                if (Number.isInteger(id)) {
                    let getDataDolphin = await Data.getDataDolphin(pageSize, paging, {id});
                    result = {
                        data: getDataDolphin.data,
                    };
                }
            }
        }

        res.status(200).json(result)
    } catch (error) {
        console.log(error)
        res.status(500).json(error.message)
    }
};

module.exports = {
    createData,
    getDataAll,
    getDataMap,
    getDataDolphin
}

