const { queryPromise } = require('../../utils/mysql');

const getDataAll = async (pageSize, paging = 0, requirement = {}) => {
    // const condition = {sql: '', binding: []};
    // const limit = {
    //     sql: 'LIMIT ?, ?',
    //     binding: [pageSize * paging, pageSize]
    // };
    const dataQuery = 
    'SELECT * FROM sailing_info ' + 
    `INNER JOIN obv_detail 
    ON sailing_info.id = obv_detail.obv_id
    INNER JOIN obv_approach
    ON sailing_info.id = obv_approach.obv_id
	INNER JOIN obv_gps 
    ON sailing_info.id = obv_gps.obv_id
	INNER JOIN obv_interaction 
    ON sailing_info.id = obv_interaction.obv_id `
     + 
     'ORDER BY sailing_info.id ASC';
    const data = await queryPromise(dataQuery)  
    return data
};

const getDataMap = async (pageSize, paging = 0, requirement = {}) => {
    const condition = {sql: '', binding: []};
    console.log(requirement)
    if (requirement.startDate && requirement.endDate && requirement.type) {
        console.log('query1')
        condition.sql = "WHERE (SUBSTRING(sailing_id, 1, 8) BETWEEN ? AND ?) AND sailing_info.dolphin_type = ?"  
        condition.binding = [requirement.startDate, requirement.endDate, requirement.type]
    }
    else if (requirement.startDate && requirement.endDate) {
        console.log('query2')
        condition.sql = "WHERE (SUBSTRING(sailing_id, 1, 8) BETWEEN ? AND ?)"  
        condition.binding = [requirement.startDate, requirement.endDate]
    } else if (requirement.type) {
        console.log('query3')
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

module.exports = {
    getDataAll,
    getDataMap,
    getDataDolphin
}