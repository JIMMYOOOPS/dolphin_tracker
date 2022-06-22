const { queryPromise } = require('../../utils/mysql');

const getDataAll = async (pageSize, paging = 0, requirement = {}) => {
    // const condition = {sql: '', binding: []};
    // const limit = {
    //     sql: 'LIMIT ?, ?',
    //     binding: [pageSize * paging, pageSize]
    // };
    const dataQuery = 'SELECT * FROM sailing_info ' + 
    `INNER JOIN obv_detail 
    ON sailing_info.id = obv_detail.obv_id
    INNER JOIN obv_approach
    ON sailing_info.id = obv_approach.obv_id
	INNER JOIN obv_gps 
    ON sailing_info.id = obv_gps.obv_id
	INNER JOIN obv_interaction 
    ON sailing_info.id = obv_interaction.obv_id `
     + 'ORDER BY sailing_info.id ASC';
    const data = await queryPromise(dataQuery)  
    return data
};

const getDataGPS = async (pageSize, paging = 0, requirement = {}) => {
    // const condition = {sql: '', binding: []};
    // const limit = {
    //     sql: 'LIMIT ?, ?',
    //     binding: [pageSize * paging, pageSize]
    // };

    const dataQuery = 'SELECT obv_id, sailing_id, year, month, day, , period, sighting_id, mix weather, wind_direction, current, latitude, latitude_min, latitude_sec, longitude, longitude_min, longitude_sec FROM sailing_info ' + 
    `INNER JOIN obv_gps ON
    sailing_info.id = obv_gps.obv_id 
    ` + 'ORDER BY obv_gps.obv_id ASC';

    const data = await queryPromise(dataQuery);
    data
    return data
};

module.exports = {
    getDataAll,
    getDataGPS
}