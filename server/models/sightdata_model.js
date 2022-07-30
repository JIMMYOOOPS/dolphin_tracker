const {pool, queryPromise} = require('../../utils/mysql');

const createSailingInfo = async (sailingInfoData) => {
  try {
    const sqlcreateSailingInfo = 'INSERT INTO sailing_info SET ?';
    const data = await queryPromise(sqlcreateSailingInfo, sailingInfoData);
    return data;
  } catch (error) {
    return error;
  }
};

const createObv = async (obvGPS, obvApproach, obvDetail, obvInteraction, image) => {
  const conn = await pool.getConnection();
  try {
    await conn.query('START TRANSACTION');
    await conn.query('INSERT INTO obv_gps SET ?', obvGPS);
    await conn.query('INSERT INTO obv_approach SET ?', obvApproach);
    await conn.query('INSERT INTO obv_detail SET ?', obvDetail);
    await conn.query('INSERT INTO obv_interaction SET ?', obvInteraction[0]);
    await conn.query('INSERT INTO obv_interaction SET ?', obvInteraction[1]);
    await conn.query('INSERT INTO obv_interaction SET ?', obvInteraction[2]);
    await conn.query('INSERT INTO obv_image SET ?', image);
    await conn.query('COMMIT');
    console.log('Done');
    return 'Success';
  } catch (error) {
    await conn.query('ROLLBACK');
    console.log(error);
    return -1;
  } finally {
    await conn.release();
  }
};

const getDataAll = async (pageSize, paging) => {
  let limit = {
    sql: '',
    binding: '',
  };
  if (pageSize !== null) {
    limit = {
      sql: 'LIMIT ?, ?',
      binding: [pageSize * paging, pageSize],
    };
  }
  const dataQuery =
    'SELECT sailing_info.id, sailing_id, obv_detail.mix, obv_detail.dolphin_type, sailing_info.sighting_id, year, month, day, period, departure, arrival, boat_size, sighting, gps_no, guide, recorder, observations, weather, wind_direction, wave_condition, current, sighting_method,  type_confirmation, dolphin_group_no, dolphin_type_no, dorsal_fin, exhalation, splash, exhibition, mother_child, mother_child_no, group_size_lowest, group_size_probable, group_size_highest, mix_type, approach_time, approach_gps_no, leaving_time, leaving_gps_no,leaving_method, latitude, latitude_min, latitude_sec, longitude, longitude_min, longitude_sec, boat_number, time, boat_interaction, boat_distance, group_closeness_normal, group_closeness_spreaded, group_closeness_close, speed_slow, speed_moderate, speed_fast, speed_resting, speed_circling, foraging_maybe, foraging_sure, mating, splash_interaction, snorkel, racing, jump, surfing_artificial, surfing,  tail_lift, contact, backstroke, boat_no, other FROM sailing_info' +
    `
    INNER JOIN obv_detail ON sailing_info.id = obv_detail.obv_id 
    INNER JOIN obv_approach ON sailing_info.id = obv_approach.obv_id 
    INNER JOIN obv_gps ON sailing_info.id = obv_gps.obv_id 
    INNER JOIN obv_interaction ON (sailing_info.id = obv_interaction.obv_id AND obv_interaction.time = "0-10")
    ` +
     ' ORDER BY sailing_info.id DESC ' +
     `${limit.sql}`
     ;
  const dataQueryi1 =
    'SELECT obv_id, time, boat_interaction, boat_distance, group_closeness_normal, group_closeness_spreaded, group_closeness_close, speed_slow, speed_moderate, speed_fast, speed_resting, speed_circling, foraging_maybe, foraging_sure, mating, splash_interaction, snorkel, racing, jump, surfing_artificial, surfing,  tail_lift, contact, backstroke, boat_no, other FROM sailing_info ' +
    `
    INNER JOIN obv_interaction ON (sailing_info.id = obv_interaction.obv_id AND obv_interaction.time = "11-20")
    ` +
    ' ORDER BY sailing_info.id DESC ' +
    `${limit.sql}`
    ;

  const dataQueryi2 =
    'SELECT obv_id, time, boat_interaction, boat_distance, group_closeness_normal, group_closeness_spreaded, group_closeness_close, speed_slow, speed_moderate, speed_fast, speed_resting, speed_circling, foraging_maybe, foraging_sure, mating, splash_interaction, snorkel, racing, jump, surfing_artificial, surfing,  tail_lift, contact, backstroke, boat_no, other FROM sailing_info ' +
    `
    INNER JOIN obv_interaction ON (sailing_info.id = obv_interaction.obv_id AND obv_interaction.time = "21-30")
    ` +
    ' ORDER BY sailing_info.id DESC ' +
    `${limit.sql}`
    ;

  const data = await queryPromise(dataQuery, limit.binding);
  const obvInteraction20mins = await queryPromise(dataQueryi1, limit.binding);
  const obvInteraction30mins = await queryPromise(dataQueryi2, limit.binding);
  const dataCountQuery = 'SELECT COUNT(*) as count FROM sailing_info ' +
    `
    INNER JOIN obv_detail ON sailing_info.id = obv_detail.obv_id 
    INNER JOIN obv_approach ON sailing_info.id = obv_approach.obv_id 
    INNER JOIN obv_gps ON sailing_info.id = obv_gps.obv_id
    INNER JOIN obv_interaction ON (sailing_info.id = obv_interaction.obv_id AND obv_interaction.time = "0-10")
     `
    ;
  const dataCounts = await queryPromise(dataCountQuery);
  return {
    'data': data,
    'obvInteraction20mins': obvInteraction20mins,
    'obvInteraction30mins': obvInteraction30mins,
    'dataCount': dataCounts[0].count,
  };
};

const updateData = async (sailingInfoData, obvGPS, obvApproach, obvDetail, obvInteraction)=> {
  try {
    const conn = await pool.getConnection();
    const sailingId = Object.values(sailingInfoData.id);
    try {
      await conn.query('START TRANSACTION');
      // Update to table sailing_info
      for (i=0; i < sailingId.length; i++) {
        const sqlUpdateQuery =
                `UPDATE sailing_info SET ? WHERE id = ?`;
        const dataSailingInfo = {
          sailing_id: sailingInfoData.sailing_id[i],
          sighting_id: sailingInfoData.sighting_id[i],
          mix: obvDetail.mix[i],
          dolphin_type: obvDetail.dolphin_type[i],
          year: sailingInfoData.year[i],
          month: sailingInfoData.month[i],
          day: sailingInfoData.day[i],
          period: sailingInfoData.period[i],
          departure: sailingInfoData.departure[i],
          arrival: sailingInfoData.arrival[i],
          boat_size: sailingInfoData.boat_size[i],
          sighting: sailingInfoData.sighting[i],
          gps_no: sailingInfoData.gps_no[i],
          guide: sailingInfoData.guide[i],
          recorder: sailingInfoData.recorder[i],
          observations: sailingInfoData.observations[i],
          weather: sailingInfoData.weather[i],
          wind_direction: sailingInfoData.wind_direction[i],
          wave_condition: sailingInfoData.wave_condition[i],
          current: sailingInfoData.current[i],
        };
        await conn.query(sqlUpdateQuery, [dataSailingInfo, [sailingId[i]]]);
      }
      // Update to table obv_gps
      for (i=0; i < sailingId.length; i++) {
        const dataObvGPS = {
          latitude: obvGPS.latitude[i],
          latitude_min: obvGPS.latitude_min[i],
          latitude_sec: obvGPS.latitude_sec[i],
          longitude: obvGPS.longitude[i],
          longitude_min: obvGPS.longitude_min[i],
          longitude_sec: obvGPS.longitude_sec[i],
        };
        await conn.query('UPDATE obv_gps SET ? WHERE obv_id = ?', [dataObvGPS, [sailingId[i]]]);
      }

      // Update to table obv_approach
      for (i=0; i < sailingId.length; i++) {
        const dataObvApproach = {
          approach_time: obvApproach.approach_time[i],
          approach_gps_no: obvApproach.approach_gps_no[i],
          leaving_time: obvApproach.leaving_time[i],
          leaving_gps_no: obvApproach.leaving_gps_no[i],
          leaving_method: obvApproach.leaving_method[i],
        };
        await conn.query('UPDATE obv_approach SET ? WHERE obv_id = ?', [dataObvApproach, [sailingId[i]]]);
      }
      // Update to table obv_detail
      for (i=0; i < sailingId.length; i++) {
        const dataObvDetail = {
          sighting_method: obvDetail.sighting_method[i],
          dolphin_type: obvDetail.dolphin_type[i],
          type_confirmation: obvDetail.type_confirmation[i],
          dolphin_group_no: obvDetail.dolphin_group_no[i],
          dolphin_type_no: obvDetail.dolphin_type_no[i],
          dorsal_fin: obvDetail.dorsal_fin[i],
          exhalation: obvDetail.exhalation[i],
          splash: obvDetail.splash[i],
          exhibition: obvDetail.exhibition[i],
          mother_child: obvDetail.mother_child[i],
          mother_child_no: obvDetail.mother_child_no[i],
          group_size_lowest: obvDetail.group_size_lowest[i],
          group_size_probable: obvDetail.group_size_probable[i],
          group_size_highest: obvDetail.group_size_highest[i],
          mix: obvDetail.mix[i],
          mix_type: obvDetail.mix_type[i],
        };
        await conn.query('UPDATE obv_detail SET ? WHERE obv_id = ?', [dataObvDetail, [sailingId[i]]]);
      }
      // Update to table obv_interaction
      for (i=0; i < sailingId.length; i++) {
        const dataObvInteraction = {
          time: obvInteraction.time1[i],
          boat_interaction: obvInteraction.boat_interaction1[i],
          boat_distance: obvInteraction.boat_distance1[i],
          group_closeness_normal: obvInteraction.group_closeness_normal1[i],
          group_closeness_spreaded: obvInteraction.group_closeness_spreaded1[i],
          group_closeness_close: obvInteraction.group_closeness_close1[i],
          speed_slow: obvInteraction.speed_slow1[i],
          speed_moderate: obvInteraction.speed_moderate1[i],
          speed_fast: obvInteraction.speed_fast1[i],
          speed_resting: obvInteraction.speed_resting1[i],
          speed_circling: obvInteraction.speed_circling1[i],
          foraging_maybe: obvInteraction.foraging_maybe1[i],
          foraging_sure: obvInteraction.foraging_sure1[i],
          mating: obvInteraction.mating1[i],
          splash_interaction: obvInteraction.splash_interaction1[i],
          snorkel: obvInteraction.snorkel1[i],
          racing: obvInteraction.racing1[i],
          jump: obvInteraction.jump1[i],
          surfing_artificial: obvInteraction.surfing_artificial1[i],
          surfing: obvInteraction.surfing1[i],
          tail_lift: obvInteraction.tail_lift1[i],
          contact: obvInteraction.contact1[i],
          backstroke: obvInteraction.backstroke1[i],
          boat_no: obvInteraction.boat_no1[i],
          other: obvInteraction.other1[i],
        };
        await conn.query('UPDATE obv_interaction SET ? WHERE (obv_id = ? AND time = "0-10")', [dataObvInteraction, [sailingId[i]]]);
      }

      for (i=0; i < sailingId.length; i++) {
        const dataObvInteraction = {
          time: obvInteraction.time2[i],
          boat_interaction: obvInteraction.boat_interaction2[i],
          boat_distance: obvInteraction.boat_distance2[i],
          group_closeness_normal: obvInteraction.group_closeness_normal2[i],
          group_closeness_spreaded: obvInteraction.group_closeness_spreaded2[i],
          group_closeness_close: obvInteraction.group_closeness_close2[i],
          speed_slow: obvInteraction.speed_slow2[i],
          speed_moderate: obvInteraction.speed_moderate2[i],
          speed_fast: obvInteraction.speed_fast2[i],
          speed_resting: obvInteraction.speed_resting2[i],
          speed_circling: obvInteraction.speed_circling2[i],
          foraging_maybe: obvInteraction.foraging_maybe2[i],
          foraging_sure: obvInteraction.foraging_sure2[i],
          mating: obvInteraction.mating2[i],
          splash_interaction: obvInteraction.splash_interaction2[i],
          snorkel: obvInteraction.snorkel2[i],
          racing: obvInteraction.racing2[i],
          jump: obvInteraction.jump2[i],
          surfing_artificial: obvInteraction.surfing_artificial2[i],
          surfing: obvInteraction.surfing2[i],
          tail_lift: obvInteraction.tail_lift2[i],
          contact: obvInteraction.contact2[i],
          backstroke: obvInteraction.backstroke2[i],
          boat_no: obvInteraction.boat_no2[i],
          other: obvInteraction.other2[i],
        };
        await conn.query('UPDATE obv_interaction SET ? WHERE (obv_id = ? AND time = "11-20")', [dataObvInteraction, [sailingId[i]]]);
      }

      for (i=0; i < sailingId.length; i++) {
        const dataObvInteraction = {
          time: obvInteraction.time3[i],
          boat_interaction: obvInteraction.boat_interaction3[i],
          boat_distance: obvInteraction.boat_distance3[i],
          group_closeness_normal: obvInteraction.group_closeness_normal3[i],
          group_closeness_spreaded: obvInteraction.group_closeness_spreaded3[i],
          group_closeness_close: obvInteraction.group_closeness_close3[i],
          speed_slow: obvInteraction.speed_slow3[i],
          speed_moderate: obvInteraction.speed_moderate3[i],
          speed_fast: obvInteraction.speed_fast3[i],
          speed_resting: obvInteraction.speed_resting3[i],
          speed_circling: obvInteraction.speed_circling3[i],
          foraging_maybe: obvInteraction.foraging_maybe3[i],
          foraging_sure: obvInteraction.foraging_sure3[i],
          mating: obvInteraction.mating3[i],
          splash_interaction: obvInteraction.splash_interaction3[i],
          snorkel: obvInteraction.snorkel3[i],
          racing: obvInteraction.racing3[i],
          jump: obvInteraction.jump3[i],
          surfing_artificial: obvInteraction.surfing_artificial3[i],
          surfing: obvInteraction.surfing3[i],
          tail_lift: obvInteraction.tail_lift3[i],
          contact: obvInteraction.contact3[i],
          backstroke: obvInteraction.backstroke3[i],
          boat_no: obvInteraction.boat_no3[i],
          other: obvInteraction.other3[i],
        };
        await conn.query('UPDATE obv_interaction SET ? WHERE (obv_id = ? AND time = "21-30")', [dataObvInteraction, [sailingId[i]]]);
      }
      await conn.query('COMMIT');
      console.log('Done');
      return 'Success';
    } catch (error) {
      await conn.query('ROLLBACK');
      console.log(error);
      return -1;
    } finally {
      await conn.release();
    }
  } catch (error) {
    return error;
  }
};

const getDataMap = async (pageSize, paging = 0, requirement = {}) => {
  const condition = {sql: '', binding: []};
  if (requirement.startDate && requirement.endDate && requirement.type) {
    condition.sql = 'WHERE (SUBSTRING(sailing_id, 1, 8) BETWEEN ? AND ?) AND sailing_info.dolphin_type = ?';
    condition.binding = [requirement.startDate, requirement.endDate, requirement.type];
  } else if (requirement.startDate && requirement.endDate) {
    condition.sql = 'WHERE (SUBSTRING(sailing_id, 1, 8) BETWEEN ? AND ?)';
    condition.binding = [requirement.startDate, requirement.endDate];
  } else if (requirement.type) {
    condition.sql = 'WHERE sailing_info.dolphin_type = ?';
    condition.binding = [requirement.type];
  }
  const dataQuery =
    'SELECT sailing_info.id, SUBSTRING(sailing_id, 1, 8) AS date, year, month, day, period, dolphin_info.name, dolphin_img.img, weather, wind_direction, current, latitude, latitude_min, latitude_sec, longitude, longitude_min, longitude_sec, sailing_info.dolphin_type, dorsal_fin, exhalation, splash, exhibition FROM sailing_info ' +
    `INNER JOIN obv_gps 
    ON sailing_info.id = obv_gps.obv_id 
    INNER JOIN obv_detail 
    ON sailing_info.id = obv_detail.obv_id
    INNER JOIN dolphin_info 
    ON sailing_info.dolphin_type = dolphin_info.name_scientific_abr
    INNER JOIN dolphin_img
    ON sailing_info.dolphin_type = dolphin_img.obv_dolphin_type 
    ` +
    ` ${condition.sql} ` +
    'ORDER BY date ASC';

  const data = await queryPromise(dataQuery, condition.binding);
  return data;
};

const getDataDolphin = async (pageSize, paging = 0, requirement = {}) => {
  const condition = {sql: '', binding: []};
  if (requirement.id != null) {
    condition.sql = 'WHERE id = ?';
    condition.binding = [requirement.id];
  }
  const limit = {
    sql: 'LIMIT ?, ?',
    binding: [pageSize * paging, pageSize],
  };
  const dataQuery =
    'SELECT * FROM dolphin_info ' +
    condition.sql +
    ' ORDER BY dolphin_info.id ASC ' + limit.sql;
  const dataBindings = condition.binding.concat(limit.binding);
  const data = await queryPromise(dataQuery, dataBindings);

  const dataCountQuery = 'SELECT COUNT(*) as count FROM dolphin_info';
  const dataCounts = await queryPromise(dataCountQuery);
  return {
    'data': data,
    'dataCount': dataCounts[0].count,
  };
};

const getDownload = async () => {
  const sqlall = 'SELECT * FROM sailing_info ' +
    `
    INNER JOIN obv_gps ON sailing_info.id = obv_gps.obv_id
    INNER JOIN obv_approach ON sailing_info.id = obv_approach.obv_id 
    INNER JOIN obv_detail ON sailing_info.id = obv_detail.obv_id 
    ` +
    ' ORDER BY sailing_info.id ASC ';
  const sqlObvInteraction = 'SELECT boat_interaction, boat_distance, group_closeness_normal, group_closeness_spreaded, group_closeness_close, speed_slow, speed_moderate, speed_fast, speed_resting, speed_circling, foraging_maybe, foraging_sure, mating, splash_interaction, snorkel, racing, jump, surfing_artificial, surfing,  tail_lift, contact, backstroke, boat_no, other FROM obv_interaction ' +
    `WHERE time = ?`;
  ' ORDER BY obv_interaction.obv_id ASC ';
  const time = ['0-10', '11-20', '21-30'];
  const all = await queryPromise(sqlall);
  const obvInteraction10 = await queryPromise(sqlObvInteraction, time[0]);
  const obvInteraction20 = await queryPromise(sqlObvInteraction, time[1]);
  const obvInteraction30 = await queryPromise(sqlObvInteraction, time[2]);
  let data = {};
  data = {
    all: all,
    obvInteraction10: obvInteraction10,
    obvInteraction20: obvInteraction20,
    obvInteraction30: obvInteraction30,
  };
  return data;
};

module.exports = {
  createSailingInfo,
  createObv,
  getDataAll,
  updateData,
  getDataMap,
  getDataDolphin,
  getDownload,
};
