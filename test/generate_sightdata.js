const xlsx2json = require('node-xlsx');
let path = require('path');
const { pool } = require('../utils/mysql')
const { NODE_ENV } = process.env;
const { datakeys, 
    getSightingData,
    sailingInfo,
    obvDetail,
    obvApproach,
    obvGps,
    obvInteraction
} = require('../utils/createsightdata');

let fileName = {};
fileName.test = 'test_sightdata_2016_2020.csv'
fileName.dev = 'sighting_2016_2020.csv'

let listTest = xlsx2json.parse(path.join(__dirname, '../data', fileName.test));
let dataTest = [...(listTest[0].data)];

async function truncateTestData() {
    const truncateTable = async (table) => {
        const conn = await pool.getConnection();
        await conn.query('START TRANSACTION');
        await conn.query('SET FOREIGN_KEY_CHECKS = ?', 0);
        await conn.query(`TRUNCATE TABLE ${table}`);
        await conn.query('SET FOREIGN_KEY_CHECKS = ?', 1);
        await conn.query('COMMIT');
        await conn.release();
        return;
    };

    const tables = ['sailing_info', 'obv_detail', 'obv_approach', 'obv_gps', 'obv_interaction', 'obv_image'];
    for(let table of tables) {
        await truncateTable(table);
    }
    return;
}

async function generateTestData() {
    try {
        let results = getSightingData(dataTest, datakeys, listTest)
        const conn = await pool.getConnection();
        await conn.query('START TRANSACTION');
        await conn.query('SET FOREIGN_KEY_CHECKS = ?', 0);
        await sailingInfo(conn, results);
        await obvDetail(conn, results);
        await obvApproach(conn, results);
        await obvGps(conn, results);
        await obvInteraction(conn, results);
        await conn.query('SET FOREIGN_KEY_CHECKS = ?', 1);
        await conn.query('COMMIT');
        conn.release();
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    truncateTestData,
    generateTestData
}