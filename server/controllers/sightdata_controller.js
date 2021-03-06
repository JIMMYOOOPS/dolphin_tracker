const _ = require('lodash');
const Data = require('../models/sightdata_model');
const Util = require('../../utils/util');
const xlsx = require('node-xlsx');
const path = require('path');
const fs = require('fs');
const { Readable } = require('stream');
let pageSize = 4;

const createData = async (req, res) => {
    try {
        const data = req.body;
        let date = data.date.split('-')
        let [year, month, day] = date;
        let boat_time = data.boat_time.replace(/:/g, '')
        let sailing_id = year + month + day + boat_time
        // For table sailing_info
        const sailingInfoData = {
            sailing_id: sailing_id,
            sighting_id: data.sighting_id,
            mix: data.mix,
            dolphin_type: data.dolphin_type,
            year: year,
            month: month,
            day: day,
            period: data.period,
            departure: data.departure,
            arrival: data.arrival,
            boat_size: data.boat_size,
            sighting: data.sighting,
            gps_no: data.gps_no,
            guide: data.guide,
            recorder: data.recorder,
            observations: data.observations,
            weather: data.weather,
            wind_direction: data.wind_direction,
            wave_condition: data.wave_condition,
            current: data.current
        };
        let sailingInfo = await Data.createSailingInfo(sailingInfoData);
        // For table obv_GPS
        const obvGPS = {
            obv_id: sailingInfo.insertId,
            latitude: data.latitude,
            latitude_min: data.latitude_min,
            latitude_sec: data.latitude_sec,
            longitude: data.longitude,
            longitude_min: data.longitude_min,
            longitude_sec: data.longitude_sec
        }
        // For table obv_approach
        const obvApproach = {
            obv_id: sailingInfo.insertId,
            approach_time: data.approach_time,
            approach_gps_no: data.approach_gps_no,
            leaving_time: data.leaving_time,
            leaving_gps_no: data.leaving_gps_no,
            leaving_method: data.leaving_method
        }
        // For table obv_detail
        const obvDetail = {
            obv_id: sailingInfo.insertId,
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

        let obvInteraction = {}
        // For table obv_interaction
        for(i = 0; i<data.time.length; i++) {
            obvInteraction[i] = {
                obv_id: sailingInfo.insertId,
                time: data.time[i],
                boat_interaction: data.boat_interaction[i],
                boat_distance: data.boat_distance[i],
                group_closeness_normal: data.group_closeness_normal[i],
                group_closeness_spreaded: data.group_closeness_spreaded[i],
                group_closeness_close: data.group_closeness_close[i],
                speed_slow: data.speed_slow[i],
                speed_moderate: data.speed_moderate[i],
                speed_fast: data.speed_fast[i],
                speed_resting: data.speed_resting[i],
                speed_circling: data.speed_circling[i],
                foraging_maybe: data.foraging_maybe[i],
                foraging_sure: data.foraging_sure[i],
                mating: data.mating[i],
                splash_interaction: data.splash_interaction[i],
                snorkel: data.snorkel[i],
                racing: data.racing[i],
                jump: data.jump[i],
                surfing_artificial: data.surfing_artificial[i],
                surfing: data.surfing[i],
                tail_lift: data.tail_lift[i],
                contact: data.contact[i],
                backstroke: data.backstroke[i],
                boat_no: data.boat_no[i],
                other: data.other[i]
            }
        }
        let image = {
            obv_id: null,
            main_image: null,
            images: null
        }
        // For table image
        if(req.files) {
            const imagePath = Util.getImagePath(req.protocol, req.hostname, sailingInfo.insertId);
            const main_image = req.files.main_image ? req.files.main_image[0].originalname : null;
            const images = req.files.other_images ? req.files.other_images[0].originalname : null;
            let location = sailingInfo.insertId
            let file = JSON.parse(JSON.stringify(req.files));
            let uploadResponse = await Util.uploadS3(file, location);
            image = {
                obv_id: location,
                main_image: main_image,
                images: images
            }

            await Data.createObv(obvGPS, obvApproach, obvDetail, obvInteraction, image);
        }
        //Recieved POST from body next step insert to DB
        let result = {
            sailing_info: sailingInfoData,
            obv_GPS: obvGPS,
            obv_approach: obvApproach,
            obv_detail: obvDetail,
            obv_interaction: obvInteraction,
            image: image
        }
        if (result) {
            res.status(200).json({
                Success: "Successfully added to database"
            }) 
        } else {
            res.status(400).json({
                message: 'Please complete the form before submitting.'
            })
        }
    } catch (error) {
        console.log(error)
    }
}

const getDataAll = async (req, res) => {
    const category = req.params.category;
    const paging = parseInt(req.query.paging) || 0;
    try {
        let result = {}
        if (category == 'all') {
            let getDataAll = await Data.getDataAll(null, null);
            result = {data: getDataAll.data};
            res.status(200).json(result);
        } else if(category == 'database') {
            pageSize = 10;
            let getDataAll = await Data.getDataAll(pageSize, paging)
            let obvInteraction20mins = getDataAll.obvInteraction20mins
            let obvInteraction30mins = getDataAll.obvInteraction30mins

            result = (getDataAll.dataCount > (paging + 1) * pageSize) ? {
                data: getDataAll.data,
                obvInteraction20mins: obvInteraction20mins,
                obvInteraction30mins: obvInteraction30mins,
                next_paging: paging + 1
            } : {
                data: getDataAll.data,
            };
            res.status(200).json(result);
        }
    } catch (error) {
        console.log(error)
    }
};

const updateData = async (req, res) => {
    const data = req.body;
    // For table sailing_info
    const sailingInfoData = { 
        id: data.id,
        sailing_id: data.sailing_id,
        sighting_id: data.sighting_id,
        mix: data.mix,
        dolphin_type: data.dolphin_type,
        year: data.year,
        month: data.month,
        day: data.day,
        period: data.period,
        departure: data.departure,
        arrival: data.arrival,
        boat_size: data.boat_size,
        sighting: data.sighting,
        gps_no: data.gps_no,
        guide: data.guide,
        recorder: data.recorder,
        observations: data.observations,
        weather: data.weather,
        wind_direction: data.wind_direction,
        wave_condition: data.wave_condition,
        current: data.current
    };
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
        time1: data.time1,
        boat_interaction1: data.boat_interaction1,
        boat_distance1: data.boat_distance1,
        group_closeness_normal1: data.group_closeness_normal1,
        group_closeness_spreaded1: data.group_closeness_spreaded1,
        group_closeness_close1: data.group_closeness_close1,
        speed_slow1: data.speed_slow1,
        speed_moderate1: data.speed_moderate1,
        speed_fast1: data.speed_fast1,
        speed_resting1: data.speed_resting1,
        speed_circling1: data.speed_circling1,
        foraging_maybe1: data.foraging_maybe1,
        foraging_sure1: data.foraging_sure1,
        mating1: data.mating1,
        splash_interaction1: data.splash_interaction1,
        snorkel1: data.snorkel1,
        racing1: data.racing1,
        jump1: data.jump1,
        surfing_artificial1: data.surfing_artificial1,
        surfing1: data.surfing1,
        tail_lift1: data.tail_lift1,
        contact1: data.contact1,
        backstroke1: data.backstroke1,
        boat_no1: data.boat_no1,
        other1: data.other1,
        time2: data.time2,
        boat_interaction2: data.boat_interaction2,
        boat_distance2: data.boat_distance2,
        group_closeness_normal2: data.group_closeness_normal2,
        group_closeness_spreaded2: data.group_closeness_spreaded2,
        group_closeness_close2: data.group_closeness_close2,
        speed_slow2: data.speed_slow2,
        speed_moderate2: data.speed_moderate2,
        speed_fast2: data.speed_fast2,
        speed_resting2: data.speed_resting2,
        speed_circling2: data.speed_circling2,
        foraging_maybe2: data.foraging_maybe2,
        foraging_sure2: data.foraging_sure2,
        mating2: data.mating2,
        splash_interaction2: data.splash_interaction2,
        snorkel2: data.snorkel2,
        racing2: data.racing2,
        jump2: data.jump2,
        surfing_artificial2: data.surfing_artificial2,
        surfing2: data.surfing2,
        tail_lift2: data.tail_lift2,
        contact2: data.contact2,
        backstroke2: data.backstroke2,
        boat_no2: data.boat_no2,
        other2: data.other2,
        time3: data.time3,
        boat_interaction3: data.boat_interaction3,
        boat_distance3: data.boat_distance3,
        group_closeness_normal3: data.group_closeness_normal3,
        group_closeness_spreaded3: data.group_closeness_spreaded3,
        group_closeness_close3: data.group_closeness_close3,
        speed_slow3: data.speed_slow3,
        speed_moderate3: data.speed_moderate3,
        speed_fast3: data.speed_fast3,
        speed_resting3: data.speed_resting3,
        speed_circling3: data.speed_circling3,
        foraging_maybe3: data.foraging_maybe3,
        foraging_sure3: data.foraging_sure3,
        mating3: data.mating3,
        splash_interaction3: data.splash_interaction3,
        snorkel3: data.snorkel3,
        racing3: data.racing3,
        jump3: data.jump3,
        surfing_artificial3: data.surfing_artificial3,
        surfing3: data.surfing3,
        tail_lift3: data.tail_lift3,
        contact3: data.contact3,
        backstroke3: data.backstroke3,
        boat_no3: data.boat_no3,
        other3: data.other3
    }
    let result = await Data.updateData(sailingInfoData, obvGPS, obvApproach, obvDetail, obvInteraction);
    res.status(200).json(result)
}

const getDataMap = async (req, res) => {
    try {
        const category = req.params.category;
        async function findSightData(category) {
            switch (category) {
                case 'all':
                    return Data.getDataMap()
                case 'date': {
                    // Gets date in range format (2016. 01. 01. - 2020. 12. 31.)
                    // Amend date format to YYYYMMDD
                    const range = req.body.range.split('. ');
                    const type = req.body.type;
                    const [startYear, startMonth, startDay, rawEndYear, endMonth, rawEndDay] = range;
                    let endDayArr = rawEndDay.split('.');
                    let endDay = endDayArr[0];
                    let endYearArr = rawEndYear.split('- ');
                    let endYear = endYearArr[1];
                    let startDate =  startYear + startMonth + startDay;
                    let endDate = endYear + endMonth + endDay;
                    if (range && type) {
                        return await Data.getDataMap(null, null, {startDate, endDate, type});
                    } else if (range) {
                        return await Data.getDataMap(null, null, {startDate, endDate});
                    };
                };
            };
        };
        let result = {}
        result = {
            data: await findSightData(category)
        }
        result["data"].forEach(e => {
            // Create function to add dolphin actions
            // Amend GPS convert function
            // GPS convert for 1998 - 2020
            if (e.latitude < 23 || e.longitude !== 121)  {
                e.latitude = null;
                e.latitude_min = null;
                e.latitude_sec = null;
                e.longitude = null;
                e.longitude_min = null;
                e.longitude_sec = null;
            } else {
                e.latitude = (e.latitude + (e.latitude_min + e.latitude_sec/1000)/60).toFixed(6);
                e.longitude = (e.longitude + (e.longitude_min + e.longitude_sec/1000)/60).toFixed(6);
                if(e.latitude > 24.68 || e.longitude < 121.61) {
                    e.latitude = null;
                    e.latitude_min = null;
                    e.latitude_sec = null;
                    e.longitude = null;
                    e.longitude_min = null;
                    e.longitude_sec = null;
                } else if (e.latitude > 23.9828 && e.latitude < 23.9855 && e.longitude > 121.6120 && e.longitude < 121.623 ) {
                    e.latitude = null;
                    e.latitude_min = null;
                    e.latitude_sec = null;
                    e.longitude = null;
                    e.longitude_min = null;
                    e.longitude_sec = null;
                } else if (e.latitude > 23.99 && e.latitude < 24.01 && e.longitude > 121.633 && e.longitude < 121.6393 ) {
                    e.latitude = null;
                    e.latitude_min = null;
                    e.latitude_sec = null;
                    e.longitude = null;
                    e.longitude_min = null;
                    e.longitude_sec = null;
                } else if (e.latitude > 24.23 && e.latitude < 24.2321 && e.longitude > 121.698349 && e.longitude < 121.698351 ) {
                    e.latitude = null;
                    e.latitude_min = null;
                    e.latitude_sec = null;
                    e.longitude = null;
                    e.longitude_min = null;
                    e.longitude_sec = null;
                }
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
                    data: getDataDolphin.data
                };
            case 'details': {
                const id = parseInt(req.query.id);
                if (Number.isInteger(id)) {
                    let getDataDolphin = await Data.getDataDolphin(pageSize, paging, {id});
                    result = {
                        data: getDataDolphin.data
                    };
                };
            }
        }
        res.status(200).json(result)
    } catch (error) {
        console.log(error)
        res.status(500).json(error.message)
    }
};

const getDownload = async (req, res) => {
  try {
      const columnName = [
          "????????????",  
          "???", 
          "???", 
          "???", 
          "??????/??????", 
          "????????????", 
          "????????????", 
          "????????????", 
          "GPS??????", 
          "????????????", 
          "?????????", 
          "?????????", 
          "?????????????????????", 
          "??????????????????",
          "????????????", 
          "????????????", 
          "??????", 
          "??????", 
          "??????", 
          "??????", 
          "????????????",
          "????????????", 
          "????????????", 
          "????????????", 
          "????????????",
          "????????????", 
          "?????????GPS??????", 
          "????????????", 
          "?????????GPS??????", 
          "????????????", 
          "????????????", 
          "????????????", 
          "????????????", 
          "????????????", 
          "????????????", 
          "????????????", 
          "????????????",
          "????????????", 
          "????????????", 
          "?????????", 
          "????????????", 
          "????????????", 
          "????????????", 
          "????????????",
          "??????", 
          "????????????", 
          "???????????? ???", 
          "???????????? ???", 
          "???????????? ???", 
          "???????????? ???", 
          "???????????? ???", 
          "???????????? ???", 
          "???????????? ???", 
          "???????????? ???", 
          "?????? ???", 
          "?????? ???", 
          "???????????? ???", 
          "?????? ???", 
          "?????? ???", 
          "???????????? ???", 
          "???????????? ???", 
          "???????????? ???", 
          "???????????? ???", 
          "???????????? ???", 
          "?????? ???", 
          "?????? ???", 
          "???????????? ???", 
          "?????? ???", 
          "????????? ???", 
          "???????????? ???",
          "???????????? ???", 
          "???????????? ???", 
          "???????????? ???", 
          "???????????? ???", 
          "???????????? ???", 
          "???????????? ???", 
          "???????????? ???", 
          "???????????? ???", 
          "?????? ???", 
          "?????? ???", 
          "???????????? ???", 
          "?????? ???", 
          "?????? ???", 
          "???????????? ???", 
          "???????????? ???", 
          "???????????? ???", 
          "???????????? ???", 
          "???????????? ???", 
          "?????? ???", 
          "?????? ???", 
          "???????????? ???", 
          "?????? ???", 
          "????????? ???", 
          "???????????? ???",
          "???????????? ???", 
          "???????????? ???", 
          "???????????? ???", 
          "???????????? ???", 
          "???????????? ???", 
          "???????????? ???", 
          "???????????? ???", 
          "???????????? ???", 
          "?????? ???", 
          "?????? ???", 
          "???????????? ???", 
          "?????? ???", 
          "?????? ???", 
          "???????????? ???", 
          "???????????? ???", 
          "???????????? ???", 
          "???????????? ???", 
          "???????????? ???", 
          "?????? ???", 
          "?????? ???", 
          "???????????? ???", 
          "?????? ???", 
          "????????? ???", 
          "???????????? ???"
      ];
      const data = await Data.getDownload();
      let dataAll = {};
      dataResult = []
      for(i=0; i<data.all.length; i++) {
          dataAll = {
              sailing_id: data.all[i].sailing_id,
              year: data.all[i].year,
              month: data.all[i].month,
              day: data.all[i].day,
              period: data.all[i].period,
              departure: data.all[i].departure,
              arrival: data.all[i].arrival,
              boat_size: data.all[i].boat_size,
              gps_no: data.all[i].gps_no,
              sighting: data.all[i].sighting,
              guide: data.all[i].guide,
              recorder: data.all[i].recorder,
              observatios: data.all[i].observatios,
              sighting_id: data.all[i].sighting_id,
              dolphin_group_no: data.all[i].dolphin_group_no,
              dolphin_type_no: data.all[i].dolphin_type_no,
              weather: data.all[i].weather,
              wind_direction: data.all[i].wind_direction,
              wave_condition: data.all[i].wave_condition,
              current: data.all[i].current,
              sighting_method: data.all[i].sighting_method,
              dorsal_fin: data.all[i].dorsal_fin,
              exhalation: data.all[i].exhalation,
              splash: data.all[i].splash,
              exhibition: data.all[i].exhibition,
              approach_time: data.all[i].approach_time,
              approach_gps_no: data.all[i].approach_gps_no,
              leaving_time: data.all[i].leaving_time,
              leaving_gps_no: data.all[i].leaving_gps_no,
              leaving_method: data.all[i].leaving_method,
              latitude: data.all[i].latitude,
              latitude_min: data.all[i].latitude_min,
              latitude_sec: data.all[i].latitude_sec,
              longitude: data.all[i].longitude,
              longitude_min: data.all[i].longitude_min,
              longitude_sec: data.all[i].longitude_sec,
              boat_number: data.all[i].boat_number,
              dolphin_type: data.all[i].dolphin_type,
              type_confirmation: data.all[i].type_confirmation,
              mother_child: data.all[i].mother_child,
              mother_child_no: data.all[i].mother_child_no,
              group_size_lowest: data.all[i].group_size_lowest,
              group_size_probable: data.all[i].group_size_probable,
              group_size_highest: data.all[i].group_size_highest,
              mix: data.all[i].mix,
              mix_type: data.all[i].mix_type 
          }
          dataResult.push(dataAll)
      }
      let obvInteraction10 = data.obvInteraction10;
      let obvInteraction20 = data.obvInteraction20;
      let obvInteraction30 = data.obvInteraction30;
      let dataArray = [];
      let obvInteraction10Array = [];
      let obvInteraction20Array = [];
      let obvInteraction30Array = []; 
      dataResult.forEach(ele => {
          dataArray.push(Object.values(ele))   
      });
      obvInteraction10.forEach(ele => {
          delete ele.obv_id
          obvInteraction10Array.push(Object.values(ele))
      });
      obvInteraction20.forEach(ele => {
          delete ele.obv_id
          obvInteraction20Array.push(Object.values(ele))   
      });
      obvInteraction30.forEach(ele => {
          delete ele.obv_id
          obvInteraction30Array.push(Object.values(ele))   
      });
      let result = [];
      for (i = 0; i < dataArray.length; i++) {
          result.push(dataArray[i].concat(obvInteraction10Array[i], obvInteraction20Array[i], obvInteraction30Array[i]))
      }
      result.unshift(columnName);

      let currentDate = new Date().toISOString().split('T')[0];
      let buffer = xlsx.build([{name: `${currentDate}_dolphin_sighting`, data: result}]);
      let stream = Readable.from(buffer)
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=' + currentDate + '-dolphinsighting.xlsx');
      stream.pipe(res);
  } catch (error) {
      console.log(error);
      res.status(500).json(error.message)
  }
}

module.exports = {
    createData,
    getDataAll,
    updateData,
    getDataMap,
    getDataDolphin,
    getDownload
}

