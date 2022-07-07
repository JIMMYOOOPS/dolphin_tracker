const {  pool, queryPromise } = require('../../utils/mysql');

const createSailingInfo = async (sailingInfoData) => {
    let sqlcreateSailingInfo = 'INSERT INTO sailing_info SET ?'
    const data = await queryPromise(sqlcreateSailingInfo, sailingInfoData)  
    return data
};

const createObv = async (obvGPS, obvApproach, obvDetail, obvInteraction, image) => {
    const conn = await pool.getConnection();
    try {
        await conn.query('START TRANSACTION');
        const result = await conn.query('INSERT INTO obv_gps SET ?', obvGPS);
        await conn.query('INSERT INTO obv_approach SET ?', obvApproach);
        await conn.query('INSERT INTO obv_detail SET ?', obvDetail);
        await conn.query('INSERT INTO obv_interaction SET ?', obvInteraction[0]);
        await conn.query('INSERT INTO obv_interaction SET ?', obvInteraction[1]);
        await conn.query('INSERT INTO obv_interaction SET ?', obvInteraction[2]);
        await conn.query('INSERT INTO obv_image SET ?', image);
        await conn.query('COMMIT');
        console.log('Done')
        return 'Success';
    } catch (error) {
        await conn.query('ROLLBACK');
        console.log(error)
        return -1;
    } finally {
        await conn.release();
    }
};

const getDataAll = async (pageSize, paging) => {
    let limit = {
        sql: '',
        binding: ''
    };
    if (pageSize !== null) {
        limit = {
            sql: 'LIMIT ?, ?',
            binding: [pageSize * paging, pageSize]
        };
    }
    const dataQuery = 
    'SELECT * FROM sailing_info ' + 
    `
    INNER JOIN obv_detail ON sailing_info.id = obv_detail.obv_id 
    INNER JOIN obv_approach ON sailing_info.id = obv_approach.obv_id 
	INNER JOIN obv_gps ON sailing_info.id = obv_gps.obv_id `
	// INNER JOIN obv_interaction ON sailing_info.id = obv_interaction.obv_id 
     +
     ' ORDER BY sailing_info.id DESC '
     +
     `${limit.sql}`
     ;
    const data = await queryPromise(dataQuery, limit.binding)
    const dataCountQuery = 'SELECT COUNT(*) as count FROM sailing_info '  + 
    `
    INNER JOIN obv_detail ON sailing_info.id = obv_detail.obv_id 
    INNER JOIN obv_approach ON sailing_info.id = obv_approach.obv_id 
	INNER JOIN obv_gps ON sailing_info.id = obv_gps.obv_id `
	// INNER JOIN obv_interaction ON sailing_info.id = obv_interaction.obv_id 
    ;
    const dataCounts = await queryPromise(dataCountQuery);
    return {
        'data': data,
        'dataCount': dataCounts[0].count
    };
};

const updateData = async (sailingInfoData, obvGPS, obvApproach, obvDetail)=> {
    try{  
        const conn = await pool.getConnection();
        const sailingId = Object.values(sailingInfoData.id);
        try {
            await conn.query('START TRANSACTION');
            // Update to table sailing_info
            for (i=0; i < sailingId.length; i++) {
                const sqlUpdateQuery = 
                `UPDATE sailing_info SET ? WHERE id = ?`;
                let dataSailingInfo = {
                    sailing_id: sailingInfoData.sailing_id[i],
                    sighting_id: sailingInfoData.sighting_id[i],
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
                    current: sailingInfoData.current[i]
                };
                await conn.query(sqlUpdateQuery, [dataSailingInfo ,[sailingId[i]]])
            }
            // Update to table obv_gps
            for (i=0; i < sailingId.length; i++) {
                let dataObvGPS = {
                    latitude: obvGPS.latitude[i],
                    latitude_min: obvGPS.latitude_min[i],
                    latitude_sec: obvGPS.latitude_sec[i],
                    longitude: obvGPS.longitude[i],
                    longitude_min: obvGPS.longitude_min[i],
                    longitude_sec: obvGPS.longitude_sec[i]
                }
                await conn.query('UPDATE obv_gps SET ? WHERE obv_id = ?', [dataObvGPS ,[sailingId[i]]]);
            }

            // Update to table obv_approach
            for (i=0; i < sailingId.length; i++) {
                let dataObvApproach = {
                    approach_time: obvApproach.approach_time[i],
                    approach_gps_no: obvApproach.approach_gps_no[i],
                    leaving_time: obvApproach.leaving_time[i],
                    leaving_gps_no: obvApproach.leaving_gps_no[i],
                    leaving_method: obvApproach.leaving_method[i]
                }
                await conn.query('UPDATE obv_approach SET ? WHERE obv_id = ?', [dataObvApproach ,[sailingId[i]]]);
            }

            console.log(obvDetail.type_confirmation);
            // Update to table obv_detail
            for (i=0; i < sailingId.length; i++) {
                let dataObvDetail = {
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
                    mother_child_no:  obvDetail.mother_child_no[i],
                    group_size_lowest: obvDetail.group_size_lowest[i],
                    group_size_probable: obvDetail.group_size_probable[i],
                    group_size_highest: obvDetail.group_size_highest[i],
                    mix: obvDetail.mix[i],
                    mix_type: obvDetail.mix_type[i]
                }
                await conn.query('UPDATE obv_detail SET ? WHERE obv_id = ?', [dataObvDetail ,[sailingId[i]]]);
            }   
            await conn.query('COMMIT');
            console.log('Done')
            return 'Success';
        } catch (error) {
            await conn.query('ROLLBACK');
            console.log(error)
            return -1;
        } finally {
            await conn.release();
        }
        // const dataQuery = 
        // `UPDATE ${table} SET (sailing_id, sighting_id, mix, dolphin_type, year, month, day, period, departure, arrival, boat_size, sighting, gps_no, guide, recorder, observations, weather, wind_direction, wave_condition, current) = WHERE ()`;  
    } catch (error) {
        console.log(error)
    }
}

const getDataMap = async (pageSize, paging = 0, requirement = {}) => {
    const condition = {sql: '', binding: []};
    console.log(requirement)
    if (requirement.startDate && requirement.endDate && requirement.type) {
        condition.sql = "WHERE (SUBSTRING(sailing_id, 1, 8) BETWEEN ? AND ?) AND sailing_info.dolphin_type = ?"  
        condition.binding = [requirement.startDate, requirement.endDate, requirement.type]
    }
    else if (requirement.startDate && requirement.endDate) {
        condition.sql = "WHERE (SUBSTRING(sailing_id, 1, 8) BETWEEN ? AND ?)"  
        condition.binding = [requirement.startDate, requirement.endDate]
    } else if (requirement.type) {
        condition.sql = "WHERE sailing_info.dolphin_type = ?"
        condition.binding = [requirement.type]
    }
    // } else if (requirement.month !=null) {
    //     condition.sql = 'WHERE year = ? AND month = ?'
    //     condition.binding = [requirement.year, requirement.month]
    // } else if (requirement.year != null) {
    //     condition.sql = 'WHERE year = ?'
    //     condition.binding = [requirement.year]
    // }
    // const limit = {
    //     sql: 'LIMIT ?, ?',
    //     binding: [pageSize * paging, pageSize]
    // };
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
    return data
};

const getDataDolphin = async (pageSize, paging = 0, requirement = {}) => {
    const condition = {sql: '', binding: []};
    if (requirement.id != null)  {
        condition.sql = 'WHERE id = ?';
        condition.binding = [requirement.id];
    }
    const limit = {
        sql: 'LIMIT ?, ?',
        binding: [pageSize * paging, pageSize]
    };
    const dataQuery = 
    'SELECT * FROM dolphin_info ' + 
    condition.sql +
    ' ORDER BY dolphin_info.id ASC ' + limit.sql
    const dataBindings = condition.binding.concat(limit.binding);
    const data = await queryPromise(dataQuery, dataBindings);

    const dataCountQuery = 'SELECT COUNT(*) as count FROM dolphin_info';
    const dataCounts = await queryPromise(dataCountQuery);
    return {
        'data': data,
        'dataCount': dataCounts[0].count
    };
};

const getDownload = async () => {
    let sqlall = 'SELECT * FROM sailing_info ' + 
    `
    INNER JOIN obv_gps ON sailing_info.id = obv_gps.obv_id
    INNER JOIN obv_approach ON sailing_info.id = obv_approach.obv_id 
    INNER JOIN obv_detail ON sailing_info.id = obv_detail.obv_id 
	 `  +
    ' ORDER BY sailing_info.id ASC '
    let sqlObvInteraction = 'SELECT boat_interaction, boat_distance, group_closeness_normal, group_closeness_spreaded, group_closeness_close, speed_slow, speed_moderate, speed_fast, speed_resting, speed_circling, foraging_maybe, foraging_sure, mating, splash_interaction, snorkel, racing, jump, surfing_artificial, surfing,  tail_lift, contact, backstroke, boat_no, other FROM obv_interaction ' + 
    `WHERE time = ?`
    ' ORDER BY obv_interaction.obv_id ASC '
    let time = ['0-10', '11-20', '21-30']
    const all = await queryPromise(sqlall);
    const obvInteraction10 = await queryPromise(sqlObvInteraction, time[0]);
    const obvInteraction20 = await queryPromise(sqlObvInteraction, time[1]);
    const obvInteraction30 = await queryPromise(sqlObvInteraction, time[2]);
    let data = {};
    data = {
        all: all,
        obvInteraction10: obvInteraction10,
        obvInteraction20: obvInteraction20,
        obvInteraction30: obvInteraction30
    }
    return data
}

module.exports = {
    createSailingInfo,
    createObv,
    getDataAll,
    updateData,
    getDataMap,
    getDataDolphin,
    getDownload
}