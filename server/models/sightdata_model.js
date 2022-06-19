const { queryPromise } = require('../../utils/mysql');

const getDataAll = async (pageSize, paging = 0, requirement = {}) => {
    const condition = {sql: '', binding: []};
    const limit = {
        sql: 'LIMIT ?, ?',
        binding: [pageSize * paging, pageSize]
    };

    const dataQuery = 'SELECT * FROM basic_info ' + 
    `INNER JOIN sighting ON 
    basic_info.id = sighting.basicinfo_id
    INNER JOIN obv_approach ON
    sighting.id = obv_approach.sighting_id
	INNER JOIN obv_detail ON
    sighting.id = obv_detail.sighting_id
	INNER JOIN obv_gps ON
    sighting.id = obv_gps.sighting_id
	INNER JOIN obv_interaction ON
    sighting.id = obv_interaction.sighting_id `
     + 'ORDER BY basic_info.sailing_id DESC';
    const data = await queryPromise(dataQuery)  
    return data
};

const getDataGPS = async (pageSize, paging = 0, requirement = {}) => {
    const condition = {sql: '', binding: []};
    const limit = {
        sql: 'LIMIT ?, ?',
        binding: [pageSize * paging, pageSize]
    };

    const dataQuery = 'SELECT sailing_id, latitude, latitude_min, latitude_sec, longtitude, longtitude_min, longtitude_sec FROM obv_gps ' + 
    `INNER JOIN sighting ON
    obv_gps.sighting_id = sighting.id
    INNER JOIN basic_info ON
    sighting.basicinfo_id = basic_info.id
    ` + 'ORDER BY obv_gps.sighting_id ASC';

    const data = await queryPromise(dataQuery);
    data
    return data
};

module.exports = {
    getDataAll,
    getDataGPS
}