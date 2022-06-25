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

const getDataGPS = async (pageSize, paging = 0, requirement = {}) => {
    // const condition = {sql: '', binding: []};
    // const limit = {
    //     sql: 'LIMIT ?, ?',
    //     binding: [pageSize * paging, pageSize]
    // };
    const dataQuery = 
    'SELECT sailing_info.id, sailing_id, year, month, day, period, sighting_id, sailing_info.mix, weather, wind_direction, current, latitude, latitude_min, latitude_sec, longitude, longitude_min, longitude_sec, dolphin_type, dorsal_fin, exhalation, splash, exhibition FROM sailing_info ' + 
    `INNER JOIN obv_gps 
    ON sailing_info.id = obv_gps.obv_id 
    INNER JOIN obv_detail 
    ON sailing_info.id = obv_detail.obv_id 
    ` + 
    'ORDER BY sailing_info.id ASC';
    const data = await queryPromise(dataQuery);
    return data
};

const getDataDolphin = async (pageSize, paging = 0, requirement = {}) => {
    console.log(requirement)
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
    getDataGPS,
    getDataDolphin
}