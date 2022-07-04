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

const updateData = async (pageSize, paging = 0)=> {
    try{
        // const dataQuery = 
        // `
        // UPDATE ${table} 
        // `;
    //     const condition = {sql: '', binding: []};
    //     switch (table) {
    //         case 'sailing_info':
    //         case 'obv_approach':
    //         case 'obv_gps':
    //         case 'obv_detail':
    //         case 'obv_interaction':
    //             break;
    //         default:
    //             break;
    //     }
    //     `UPDATE [LOW_PRIORITY] [IGNORE] table_name 
    //     SET 
    //         column_name1 = expr1,
    //         column_name2 = expr2,
    //         ...
    //     [WHERE
    //         condition]
    // ;`
    } catch (error) {
        console.log(error)
    }
}

const deleteData = async ()=> {
    try {
    //     const condition = {sql: '', binding: []};
    //     switch (key) {
    //         case 'sailing_info':
    //         case 'obv_approach':
    //         case 'obv_gps':
    //         case 'obv_detail':
    //         case 'obv_interaction':
    //             break;
    //         default:
    //             break;
    //     }
    //     `UPDATE [LOW_PRIORITY] [IGNORE] table_name 
    //     SET 
    //         column_name1 = expr1,
    //         column_name2 = expr2,
    //         ...
    //     [WHERE
    //         condition]
    // ;`
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

module.exports = {
    createSailingInfo,
    createObv,
    getDataAll,
    updateData,
    deleteData,
    getDataMap,
    getDataDolphin
}