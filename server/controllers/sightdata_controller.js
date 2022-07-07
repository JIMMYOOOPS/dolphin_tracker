const _ = require('lodash');
const Data = require('../models/sightdata_model');
const Util = require('../../utils/util');
const xlsx = require('node-xlsx');
const past = require('path');
let pageSize = 4;

const createData = async (req, res) => {
    try {
        const data = req.body;
        let date = data.datepicker.split('/')
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
                splash_interaction: data.splash[i],
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
        // For table image
        const imagePath = Util.getImagePath(req.protocol, req.hostname, sailingInfo.insertId);
        const main_image = req.files.main_image ? req.files.main_image[0].filename : null;
        const images = req.files.other_images ? req.files.other_images.map(
            img => ([img.filename])
        ) : null
        let location = sailingInfo.insertId
        let file = JSON.parse(JSON.stringify(req.files));
        let uploadResponse = await Util.uploadS3(file, location)
        const image = {
            obv_id: sailingInfo.insertId,
            main_image: main_image,
            images: images
        }

        await Data.createObv(obvGPS, obvApproach, obvDetail, obvInteraction, image);

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
            res.status(200).redirect('/console_sighting.html') 
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
            result = (getDataAll.dataCount > (paging + 1) * pageSize) ? {
                data: getDataAll.data,
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
    let result = await Data.updateData(sailingInfoData, obvGPS, obvApproach, obvDetail);
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
                    const range = req.body.range.split('. ')
                    const type = req.body.type
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
            // Create function to add dolphin actions
            // Amend GPS convert function
            
            // GPS convert for 1998 - 2020
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

const getDownloadExcel = async (req, res) => {
    try {
        console.log('123');
        // const data = [
        //     ["航次編號"],
        //     ["目擊記錄編號"],
        //     ["混群"],
        //     ["鯨豚種類"],
        //     ["年"],
        //     ["月"],
        //     ["日"],
        //     ["上午/下午"],
        //     ["出港時間"],
        //     ["進港時間"],
        //     ["船隻大小"],
        //     ["看到鯨豚"],
        //     ["GPS編號"],
        //     ["解說員"],
        //     ["攝影者"],
        //     ["特殊觀察與記錄"],
        //     ["天氣"],
        //     ["風向"],
        //     ["浪況"],
        //     ["海流"],
        //     ["鯨豚緯度"],
        //     ["鯨豚緯分"],
        //     ["鯨豚緯秒"],
        //     ["鯨豚經度"],
        //     ["鯨豚經分"],
        //     ["鯨豚經秒"],
        //     ["靠近時間"],
        //     ["靠近時GPS編號"],
        //     ["離開時間"],
        //     ["離開時GPS編號"],
        //     ["離開方式"],
        //     ["發現方式"],
        //     ["鯨豚確認"],
        //     ["鯨豚群次"],
        //     ["鯨豚種數"],
        //     ["線索背鰭"],
        //     ["線索噴氣"],
        //     ["線索水花"],
        //     ["線索展示"],
        //     ["母子對"],
        //     ["母子對數"],
        //     ["群量至少"],
        //     ["群量可能"],
        //     ["群量最多"],
        //     ["混群種類"],
        //     ["船隻互動"],
        //     ["最近距離"],
        //     ["群體一般"],
        //     ["群體零散"],
        //     ["群體緊密"],
        //     ["行進中慢"],
        //     ["行進中平"],
        //     ["行進中急"],
        //     ["休息"],
        //     ["兜圈"],
        //     ["拍打水面"],
        //     ["浮窺"],
        //     ["飆船"],
        //     ["空中展示"],
        //     ["人為衝浪"],
        //     ["自然衝浪"],
        //     ["可能覓食"],
        //     ["確定覓食"],
        //     ["舉尾"],
        //     ["交配"],
        //     ["身體觸碰"],
        //     ["仰泳"],
        //     ["船數量"],
        //     ["補充說明"]
        // ];
        res.status(200).json('123');
        // let currentDate = new Date().Format("yyyy-MM-dd");
        // let downloadDir = path.resolve(__dirname, '../', 'public', 'downloadfile');
        // let dir = downloadDir+"/"+currentDate + '鯨豚目擊紀錄.xlsx'
        // let buffer = xlsx.build([{name: `${currentDate}_dolphin_sighting`, data: data}]);
        // console.log(buffer);
        // fs.writeFileSync(dir, buffer, 'binary');
        // res.status(200).json(dir);
        // return dir;
        // let getDataAll = await Data.getDataAll(null, null);
        // result = {data: getDataAll.data};
        // let data = [];
        // results.forEach((row) => {
        //   data.push([
        //     row["航次編號"],
        //     row["目擊記錄編號"],
        //     row["混群"],
        //     row["鯨豚種類"],
        //     row["年"],
        //     row["月"],
        //     row["日"],
        //     row["上午/下午"],
        //     row["出港時間"],
        //     row["進港時間"],
        //     row["船隻大小"],
        //     row["看到鯨豚"],
        //     row["GPS編號"],
        //     row["解說員"],
        //     row["攝影者"],
        //     row["特殊觀察與記錄"],
        //     row["天氣"],
        //     row["風向"],
        //     row["浪況"],
        //     row["海流"],
        //     row["鯨豚緯度"],
        //     row["鯨豚緯分"],
        //     row["鯨豚緯秒"],
        //     row["鯨豚經度"],
        //     row["鯨豚經分"],
        //     row["鯨豚經秒"],
        //     row["靠近時間"],
        //     row["靠近時GPS編號"],
        //     row["離開時間"],
        //     row["離開時GPS編號"],
        //     row["離開方式"],
        //     row["發現方式"],
        //     row["鯨豚確認"],
        //     row["鯨豚群次"],
        //     row["鯨豚種數"],
        //     row["線索背鰭"],
        //     row["線索噴氣"],
        //     row["線索水花"],
        //     row["線索展示"],
        //     row["母子對"],
        //     row["母子對數"],
        //     row["群量至少"],
        //     row["群量可能"],
        //     row["群量最多"],
        //     row["混群種類"],
        //     row["船隻互動"],
        //     row["最近距離"],
        //     row["群體一般"],
        //     row["群體零散"],
        //     row["群體緊密"],
        //     row["行進中慢"],
        //     row["行進中平"],
        //     row["行進中急"],
        //     row["休息"],
        //     row["兜圈"],
        //     row["拍打水面"],
        //     row["浮窺"],
        //     row["飆船"],
        //     row["空中展示"],
        //     row["人為衝浪"],
        //     row["自然衝浪"],
        //     row["可能覓食"],
        //     row["確定覓食"],
        //     row["舉尾"],
        //     row["交配"],
        //     row["身體觸碰"],
        //     row["仰泳"],
        //     row["船數量"],
        //     row["補充說明"]
        //     ]);
        // });
    } catch (error) {
        console.log(error)
        res.status(500).json(error.message)
    }
}

module.exports = {
    createData,
    getDataAll,
    updateData,
    getDataMap,
    getDataDolphin,
    getDownloadExcel
}

