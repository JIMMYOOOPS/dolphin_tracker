const _ = require('lodash');
const Data = require('../models/sightdata_model');
const Util = require('../../utils/util');
const xlsx = require('node-xlsx');
const path = require('path');
const fs = require('fs')
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
            // mix: data.mix,
            // dolphin_type: data.dolphin_type,
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
        let uploadResponse = await Util.uploadS3(file, location);
        console.log('here', uploadResponse);
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

const getDownload = async (req, res) => {
  try {
      const columnName = [
          "航次編號",  
          "年", 
          "月", 
          "日", 
          "上午/下午", 
          "出港時間", 
          "進港時間", 
          "船隻大小", 
          "GPS編號", 
          "看到鯨豚", 
          "解說員", 
          "攝影者", 
          "特殊觀察與記錄", 
          "目擊記錄編號",
          "鯨豚群次", 
          "鯨豚種數", 
          "天氣", 
          "風向", 
          "浪況", 
          "海流", 
          "發現方式",
          "線索背鰭", 
          "線索噴氣", 
          "線索水花", 
          "線索展示",
          "靠近時間", 
          "靠近時GPS編號", 
          "離開時間", 
          "離開時GPS編號", 
          "離開方式", 
          "鯨豚緯度", 
          "鯨豚緯分", 
          "鯨豚緯秒", 
          "鯨豚經度", 
          "鯨豚經分", 
          "鯨豚經秒", 
          "船隻編號",
          "鯨豚種類", 
          "鯨豚確認", 
          "母子對", 
          "母子對數", 
          "群量至少", 
          "群量可能", 
          "群量最多",
          "混群", 
          "混群種類", 
          "船隻互動 一", 
          "最近距離 一", 
          "群體一般 一", 
          "群體零散 一", 
          "群體緊密 一", 
          "行進中慢 一", 
          "行進中平 一", 
          "行進中急 一", 
          "休息 一", 
          "兜圈 一", 
          "拍打水面 一", 
          "浮窺 一", 
          "飆船 一", 
          "空中展示 一", 
          "人為衝浪 一", 
          "自然衝浪 一", 
          "可能覓食 一", 
          "確定覓食 一", 
          "舉尾 一", 
          "交配 一", 
          "身體觸碰 一", 
          "仰泳 一", 
          "船數量 一", 
          "補充說明 一",
          "船隻互動 二", 
          "最近距離 二", 
          "群體二般 二", 
          "群體零散 二", 
          "群體緊密 二", 
          "行進中慢 二", 
          "行進中平 二", 
          "行進中急 二", 
          "休息 二", 
          "兜圈 二", 
          "拍打水面 二", 
          "浮窺 二", 
          "飆船 二", 
          "空中展示 二", 
          "人為衝浪 二", 
          "自然衝浪 二", 
          "可能覓食 二", 
          "確定覓食 二", 
          "舉尾 二", 
          "交配 二", 
          "身體觸碰 二", 
          "仰泳 二", 
          "船數量 二", 
          "補充說明 二",
          "船隻互動 三", 
          "最近距離 三", 
          "群體三般 三", 
          "群體零散 三", 
          "群體緊密 三", 
          "行進中慢 三", 
          "行進中平 三", 
          "行進中急 三", 
          "休息 三", 
          "兜圈 三", 
          "拍打水面 三", 
          "浮窺 三", 
          "飆船 三", 
          "空中展示 三", 
          "人為衝浪 三", 
          "自然衝浪 三", 
          "可能覓食 三", 
          "確定覓食 三", 
          "舉尾 三", 
          "交配 三", 
          "身體觸碰 三", 
          "仰泳 三", 
          "船數量 三", 
          "補充說明 三"
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
      let downloadDir = path.resolve(__dirname, '../../', 'public', 'downloadfile');
      let dir = downloadDir+ '/' + currentDate + '鯨豚目擊紀錄.xlsx';
      fs.writeFileSync(dir, buffer);
      res.status(200).json(dir);            
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

