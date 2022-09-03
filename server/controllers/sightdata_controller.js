const Data = require('../models/sightdata_model');
const Util = require('../../utils/util');
const xlsx = require('node-xlsx');
const { Readable } = require('stream');
let pageSize = 4;
const imageHost = 'https://d1h1kjqdrbfuwo.cloudfront.net/';

const createData = async (req, res) => {
  try {
    const data = req.body;
    const date = data.date.split('-');
    const [year, month, day] = date;
    function getBoatTime() {
      const boat_time = data.boat_time.replace(/:/g, '');
      return year + month + day + boat_time;
    }
    const sailing_id = getBoatTime();
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
      current: data.current,
    };
    const sailingInfo = await Data.createSailingInfo(sailingInfoData);
    // For table obv_GPS
    const obvGPS = {
      obv_id: sailingInfo.insertId,
      latitude: data.latitude,
      latitude_min: data.latitude_min,
      latitude_sec: data.latitude_sec,
      longitude: data.longitude,
      longitude_min: data.longitude_min,
      longitude_sec: data.longitude_sec,
    };
    // For table obv_approach
    const obvApproach = {
      obv_id: sailingInfo.insertId,
      approach_time: data.approach_time,
      approach_gps_no: data.approach_gps_no,
      leaving_time: data.leaving_time,
      leaving_gps_no: data.leaving_gps_no,
      leaving_method: data.leaving_method,
    };
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
      mother_child_no: data.mother_child_no,
      group_size_lowest: data.group_size_lowest,
      group_size_probable: data.group_size_probable,
      group_size_highest: data.group_size_highest,
      mix: data.mix,
      mix_type: data.mix_type,
    };

    const obvInteraction = {};
    // For table obv_interaction(0-10, 11-20, 21-30)
    for (i = 0; i < data.time.length; i++) {
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
        other: data.other[i],
      };
    }
    const location = sailingInfo.insertId;
    const file = req.files;
    // For table image
    async function uploadImage(file, location) {
      const uploadResponse = await Util.uploadS3(file, location);
      const main_imageLocation = uploadResponse[0]
        ? imageHost + uploadResponse[0].key
        : null;
      const imagesLocation = uploadResponse[1]
        ? imageHost + uploadResponse[1].key
        : null;
      const image = {
        obv_id: location,
        main_image: main_imageLocation,
        images: imagesLocation,
      };
      console.log(image);
      return image;
    }
    const image = await uploadImage(file, location);
    await Data.createObv(obvGPS, obvApproach, obvDetail, obvInteraction, image);
    // Recieved POST from body next step insert to DB
    const result = {
      sailing_info: sailingInfoData,
      obv_GPS: obvGPS,
      obv_approach: obvApproach,
      obv_detail: obvDetail,
      obv_interaction: obvInteraction,
      image: image,
    };
    if (result) {
      res.status(201).json({
        Success: 'Successfully added to database',
      });
    }
  } catch (error) {
    throw error;
  }
};

const getDataAll = async (req, res) => {
  const category = req.params.category;
  const paging = parseInt(req.query.paging) || 0;
  try {
    let result = {};
    if (category == 'all') {
      const getDataAll = await Data.getDataAll(null, null);
      result = { data: getDataAll.data };
      res.status(200).json(result);
    } else if (category == 'database') {
      pageSize = 10;
      const getDataAll = await Data.getDataAll(pageSize, paging);
      const obvInteraction20mins = getDataAll.obvInteraction20mins;
      const obvInteraction30mins = getDataAll.obvInteraction30mins;

      result =
        getDataAll.dataCount > (paging + 1) * pageSize
          ? {
              data: getDataAll.data,
              obvInteraction20mins: obvInteraction20mins,
              obvInteraction30mins: obvInteraction30mins,
              next_paging: paging + 1,
            }
          : {
              data: getDataAll.data,
            };
      res.status(200).json(result);
    }
  } catch (error) {
    return error;
  }
};

const updateData = async (req, res) => {
  const data = req.body;
  try {
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
      current: data.current,
    };
    // For table obv_GPS
    const obvGPS = {
      latitude: data.latitude,
      latitude_min: data.latitude_min,
      latitude_sec: data.latitude_sec,
      longitude: data.longitude,
      longitude_min: data.longitude_min,
      longitude_sec: data.longitude_sec,
    };
    // For table obv_approach
    const obvApproach = {
      approach_time: data.approach_time,
      approach_gps_no: data.approach_gps_no,
      leaving_time: data.leaving_time,
      leaving_gps_no: data.leaving_gps_no,
      leaving_method: data.leaving_method,
    };
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
      mother_child_no: data.mother_child_no,
      group_size_lowest: data.group_size_lowest,
      group_size_probable: data.group_size_probable,
      group_size_highest: data.group_size_highest,
      mix: data.mix,
      mix_type: data.mix_type,
    };
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
      other3: data.other3,
    };
    const result = await Data.updateData(
      sailingInfoData,
      obvGPS,
      obvApproach,
      obvDetail,
      obvInteraction
    );
    res.status(200).json(result);
  } catch (error) {
    return error;
  }
};

const getDataMap = async (req, res) => {
  try {
    const category = req.params.category;
    async function findSightData(category) {
      switch (category) {
        case 'all':
          return Data.getDataMap();
        case 'date': {
          // Gets date in range format (2016. 01. 01. - 2020. 12. 31.)
          // Amend date format to YYYYMMDD
          const range = req.body.range.split('. ');
          const type = req.body.type;
          const [
            startYear,
            startMonth,
            startDay,
            rawEndYear,
            endMonth,
            rawEndDay,
          ] = range;
          const endDayArr = rawEndDay.split('.');
          const endDay = endDayArr[0];
          const endYearArr = rawEndYear.split('- ');
          const endYear = endYearArr[1];
          const startDate = startYear + startMonth + startDay;
          const endDate = endYear + endMonth + endDay;
          if (range && type) {
            return await Data.getDataMap(null, null, {
              startDate,
              endDate,
              type,
            });
          } else if (range) {
            return await Data.getDataMap(null, null, { startDate, endDate });
          }
        }
      }
    }
    let result = {
      data: await findSightData(category),
    };
    result = Util.GPSConvert(result);
    res.status(200).json(result);
  } catch (error) {
    return error;
  }
};

const getDataDolphin = async (req, res) => {
  const category = req.params.category;
  const paging = parseInt(req.query.paging) || 0;
  try {
    let result = {};
    switch (category) {
      case 'all':
        const getDataDolphin = await Data.getDataDolphin(pageSize, paging);
        result =
          getDataDolphin.dataCount > (paging + 1) * pageSize
            ? {
                data: getDataDolphin.data,
                next_paging: paging + 1,
              }
            : {
                data: getDataDolphin.data,
              };
      case 'details': {
        const id = parseInt(req.query.id);
        if (Number.isInteger(id)) {
          const getDataDolphin = await Data.getDataDolphin(pageSize, paging, {
            id,
          });
          result = {
            data: getDataDolphin.data,
          };
        }
      }
    }
    res.status(200).json(result);
  } catch (error) {
    return error;
  }
};

const getDownload = async (req, res) => {
  try {
    const columnName = [
      '航次編號',
      '年',
      '月',
      '日',
      '上午/下午',
      '出港時間',
      '進港時間',
      '船隻大小',
      'GPS編號',
      '看到鯨豚',
      '解說員',
      '攝影者',
      '特殊觀察與記錄',
      '目擊記錄編號',
      '鯨豚群次',
      '鯨豚種數',
      '天氣',
      '風向',
      '浪況',
      '海流',
      '發現方式',
      '線索背鰭',
      '線索噴氣',
      '線索水花',
      '線索展示',
      '靠近時間',
      '靠近時GPS編號',
      '離開時間',
      '離開時GPS編號',
      '離開方式',
      '鯨豚緯度',
      '鯨豚緯分',
      '鯨豚緯秒',
      '鯨豚經度',
      '鯨豚經分',
      '鯨豚經秒',
      '船隻編號',
      '鯨豚種類',
      '鯨豚確認',
      '母子對',
      '母子對數',
      '群量至少',
      '群量可能',
      '群量最多',
      '混群',
      '混群種類',
      '船隻互動 一',
      '最近距離 一',
      '群體一般 一',
      '群體零散 一',
      '群體緊密 一',
      '行進中慢 一',
      '行進中平 一',
      '行進中急 一',
      '休息 一',
      '兜圈 一',
      '拍打水面 一',
      '浮窺 一',
      '飆船 一',
      '空中展示 一',
      '人為衝浪 一',
      '自然衝浪 一',
      '可能覓食 一',
      '確定覓食 一',
      '舉尾 一',
      '交配 一',
      '身體觸碰 一',
      '仰泳 一',
      '船數量 一',
      '補充說明 一',
      '船隻互動 二',
      '最近距離 二',
      '群體二般 二',
      '群體零散 二',
      '群體緊密 二',
      '行進中慢 二',
      '行進中平 二',
      '行進中急 二',
      '休息 二',
      '兜圈 二',
      '拍打水面 二',
      '浮窺 二',
      '飆船 二',
      '空中展示 二',
      '人為衝浪 二',
      '自然衝浪 二',
      '可能覓食 二',
      '確定覓食 二',
      '舉尾 二',
      '交配 二',
      '身體觸碰 二',
      '仰泳 二',
      '船數量 二',
      '補充說明 二',
      '船隻互動 三',
      '最近距離 三',
      '群體三般 三',
      '群體零散 三',
      '群體緊密 三',
      '行進中慢 三',
      '行進中平 三',
      '行進中急 三',
      '休息 三',
      '兜圈 三',
      '拍打水面 三',
      '浮窺 三',
      '飆船 三',
      '空中展示 三',
      '人為衝浪 三',
      '自然衝浪 三',
      '可能覓食 三',
      '確定覓食 三',
      '舉尾 三',
      '交配 三',
      '身體觸碰 三',
      '仰泳 三',
      '船數量 三',
      '補充說明 三',
    ];
    const data = await Data.getDownload();
    let dataAll = {};
    dataResult = [];
    for (i = 0; i < data.all.length; i++) {
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
        mix_type: data.all[i].mix_type,
      };
      dataResult.push(dataAll);
    }
    const dataArray = [];
    dataResult.forEach((ele) => {
      dataArray.push(Object.values(ele));
    });
    const obvInteraction10Array = [];
    const obvInteraction20Array = [];
    const obvInteraction30Array = [];
    function dataToArray(data, dataArray) {
      data.forEach((ele) => {
        delete ele.obv_id;
        dataArray.push(Object.values(ele));
      });
    }
    dataToArray(data.obvInteraction10, obvInteraction10Array);
    dataToArray(data.obvInteraction20, obvInteraction20Array);
    dataToArray(data.obvInteraction30, obvInteraction30Array);

    const result = [];
    for (i = 0; i < dataArray.length; i++) {
      result.push(
        dataArray[i].concat(
          obvInteraction10Array[i],
          obvInteraction20Array[i],
          obvInteraction30Array[i]
        )
      );
    }
    result.unshift(columnName);

    const currentDate = new Date().toISOString().split('T')[0];
    const buffer = xlsx.build([
      { name: `${currentDate}_dolphin_sighting`, data: result },
    ]);
    const stream = Readable.from(buffer);
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=' + currentDate + '-dolphinsighting.xlsx'
    );
    stream.pipe(res);
  } catch (error) {
    return error;
  }
};

module.exports = {
  createData,
  getDataAll,
  updateData,
  getDataMap,
  getDataDolphin,
  getDownload,
};
