const xlsx2json = require('node-xlsx');
const path = require('path');

const fileName = 'sighting_2016_2020.csv';

const list = xlsx2json.parse(path.join(__dirname, '../data', fileName));
const data = [...(list[0].data[0])];

const datakeys = [
  'sailing_id', 'year', 'month', 'day', 'period', 'departure', 'arrival', 'boat_size', 'gps_no', 'sighting', 'guide', 'recorder',
  'observations', 'sighting_id', 'dolphin_group_no', 'dolphin_type_no', 'weather', 'wind_direction', 'wave_condition', 'current',
  'sighting_method', 'dorsal_fin', 'exhalation', 'splash', 'exhibition', 'approach_time', 'approach_gps_no', 'leaving_time', 'leaving_gps_no',
  'leaving_method', 'latitude', 'latitude_min', 'latitude_sec', 'longitude', 'longitude_min', 'longitude_sec', 'boat_number', 'dolphin_type',
  'type_confirmation', 'mother_child', 'mother_child_no', 'group_size_lowest', 'group_size_probable', 'group_size_highest', 'mix', 'mix_type',
  // 10min interaction
  'one_boat_interaction', 'one_boat_distance', 'one_group_closeness_normal', 'one_group_closeness_spreaded', 'one_group_closeness_close', 'one_speed_slow', 'one_speed_moderate', 'one_speed_fast', 'one_speed_resting', 'one_speed_circling', 'one_splash', 'one_snorkel', 'one_racing', 'one_jump', 'one_surfing_artificial', 'one_surfing', 'one_foraging_maybe', 'one_foraging_sure', 'one_tail_lift', 'one_mating', 'one_contact', 'one_backstroke', 'one_boat_no', 'one_other',
  // 20min interaction
  'two_boat_interaction', 'two_boat_distance', 'two_group_closeness_normal', 'two_group_closeness_spreaded', 'two_group_closeness_close',
  'two_speed_slow', 'two_speed_moderate', 'two_speed_fast', 'two_speed_resting', 'two_speed_circling', 'two_splash', 'two_snorkel', 'two_racing', 'two_jump', 'two_surfing_artificial', 'two_surfing', 'two_foraging_maybe', 'two_foraging_sure', 'two_tail_lift', 'two_mating', 'two_contact', 'two_backstroke', 'two_boat_no', 'two_other',
  // 30min interaction
  'three_boat_interaction', 'three_boat_distance', 'three_group_closeness_normal', 'three_group_closeness_spreaded', 'three_group_closeness_close', 'three_speed_slow', 'three_speed_moderate', 'three_speed_fast', 'three_speed_resting', 'three_speed_circling', 'three_splash', 'three_snorkel', 'three_racing', 'three_jump', 'three_surfing_artificial', 'three_surfing', 'three_foraging_maybe', 'three_foraging_sure', 'three_tail_lift', 'three_mating', 'three_contact', 'three_backstroke', 'three_boat_no', 'three_other',
];

function getSightingData(data, datakeys, list) {
  try {
    const results = [];
    for (let i = 1; i < data.length; i++) {
      const datarow = [...(list[0].data[i])];
      const param = {};
      datakeys.forEach((key, j)=> {
        param[key] = datarow[j];
      });
      results.push(param);
    }
    if (results) {
      console.log('Excel to JS success');
      return results;
    } else {
      console.log('Excel to JS fail');
    }
  } catch (err) {
    console.log(err.message);
  }
}

async function sailingInfo(conn, results) {
  // Insert table sailing_info
  const sailingInfoArray = [];
  results.forEach((result) => {
    const createSailingInfo = [result.sailing_id, result.sighting_id, result.mix, result.dolphin_type, result.year, result.month, result.day, result.period, result.departure, result.arrival, result.boat_size, result.sighting, result.gps_no, result.guide, result.recorder, result.observations, result.weather, result.wind_direction, result.wave_condition, result.current];
    sailingInfoArray.push(createSailingInfo);
  });
  const sqlSailingInfo = 'INSERT INTO sailing_info (sailing_id, sighting_id, mix, dolphin_type, year, month, day, period, departure, arrival, boat_size, sighting, gps_no, guide, recorder, observations, weather, wind_direction, wave_condition, current) VALUES ?';
  // Create table sailing_info
  return await conn.query(sqlSailingInfo, [sailingInfoArray]); // set params for PK
}

async function obvDetail(conn, results) {
  const obvDetailArray = [];
  results.forEach((result, obvId) => {
    const createObvDetail = [obvId + 1, result.sighting_method, result.dolphin_type, result.type_confirmation, result.dolphin_group_no, result.dolphin_type_no, result.dorsal_fin, result.exhalation, result.splash, result.exhibition, result.mother_child, result.mother_child_no, result.group_size_lowest, result.group_size_probable, result.group_size_highest, result.mix, result.mix_type];
    obvDetailArray.push(createObvDetail);
  });
  const sqlCreateObvDetail = 'INSERT INTO obv_detail (obv_id, sighting_method, dolphin_type, type_confirmation, dolphin_group_no, dolphin_type_no, dorsal_fin, exhalation, splash, exhibition, mother_child, mother_child_no, group_size_lowest, group_size_probable, group_size_highest, mix, mix_type) VALUES ?';
  // Create table obv_detail
  return await conn.query(sqlCreateObvDetail, [obvDetailArray]);
}

async function obvApproach(conn, results) {
  const obvApproachArray = [];
  results.forEach((result, obvId) => {
    const createObvApproach = [obvId + 1, result.approach_time, result.approach_gps_no, result.leaving_time, result.leaving_gps_no, result.leaving_method];
    obvApproachArray.push(createObvApproach);
  });
  const sqlCreateObvApproach = 'INSERT INTO obv_approach (obv_id, approach_time, approach_gps_no, leaving_time, leaving_gps_no,leaving_method) VALUES ?';
  // Create table obv_approach
  return await conn.query(sqlCreateObvApproach, [obvApproachArray]);
}

async function obvGps(conn, results) {
  const obvGPS = [];
  results.forEach((result, obvId) => {
    const createObvGPS = [obvId + 1, result.latitude, result.latitude_min, result.latitude_sec, result.longitude, result.longitude_min, result.longitude_sec, result.boat_number];
    obvGPS.push(createObvGPS);
  });
  const sqlCreateObvGPS = 'INSERT INTO obv_gps (obv_id, latitude, latitude_min, latitude_sec, longitude, longitude_min, longitude_sec, boat_number) VALUES ?';
  // Create table obv_gps
  return await conn.query(sqlCreateObvGPS, [obvGPS]);
}

async function obvInteraction(conn, results) {
  const obvInteraction10mins = [];
  const obvInteraction20mins = [];
  const obvInteraction30mins = [];
  results.forEach((result, obvId) => {
    const createObvInteraction10mins = [obvId + 1, '0-10', result.one_boat_interaction, result.one_boat_distance, result.one_group_closeness_normal, result.one_group_closeness_spreaded, result.one_group_closeness_close, result.one_speed_slow, result.one_speed_moderate, result.one_speed_fast, result.one_speed_resting, result.one_speed_circling, result.one_foraging_maybe, result.one_foraging_sure, result.one_mating, result.one_splash, result.one_snorkel, result.one_racing, result.one_jump, result.one_surfing_artificial, result.one_surfing, result.one_tail_lift, result.one_contact, result.one_backstroke, result.one_boat_no, result.one_other];
    const createObvInteraction20mins = [obvId + 1, '11-20', result.two_boat_interaction, result.two_boat_distance, result.two_group_closeness_normal, result.two_group_closeness_spreaded, result.two_group_closeness_close, result.two_speed_slow, result.two_speed_moderate, result.two_speed_fast, result.two_speed_resting, result.two_speed_circling, result.two_foraging_maybe, result.two_foraging_sure, result.two_mating, result.two_splash, result.two_snorkel, result.two_racing, result.two_jump, result.two_surfing_artificial, result.two_surfing, result.two_tail_lift, result.two_contact, result.two_backstroke, result.two_boat_no, result.two_other];
    const createObvInteraction30mins = [obvId + 1, '21-30', result.three_boat_interaction, result.three_boat_distance, result.three_group_closeness_normal, result.three_group_closeness_spreaded, result.three_group_closeness_close, result.three_speed_slow, result.three_speed_moderate, result.three_speed_fast, result.three_speed_resting, result.three_speed_circling, result.three_foraging_maybe, result.three_foraging_sure, result.three_mating, result.three_splash, result.three_snorkel, result.three_racing, result.three_jump, result.three_surfing_artificial, result.three_surfing, result.three_tail_lift, result.three_contact, result.three_backstroke, result.three_boat_no, result.three_other];
    obvInteraction10mins.push(createObvInteraction10mins);
    obvInteraction20mins.push(createObvInteraction20mins);
    obvInteraction30mins.push(createObvInteraction30mins);
  }); ;
  const sqlCreateObvInteraction = 'INSERT INTO obv_interaction (obv_id, time, boat_interaction, boat_distance, group_closeness_normal, group_closeness_spreaded, group_closeness_close, speed_slow, speed_moderate, speed_fast, speed_resting, speed_circling, foraging_maybe, foraging_sure, mating, splash_interaction, snorkel, racing, jump, surfing_artificial, surfing,  tail_lift, contact, backstroke, boat_no, other) VALUES ?';
  // Create table obv_interaction
  await conn.query(sqlCreateObvInteraction, [obvInteraction10mins]);
  await conn.query(sqlCreateObvInteraction, [obvInteraction20mins]);
  await conn.query(sqlCreateObvInteraction, [obvInteraction30mins]);
  return;
}

module.exports = {
  datakeys,
  getSightingData,
  sailingInfo,
  obvDetail,
  obvApproach,
  obvGps,
  obvInteraction,
};
