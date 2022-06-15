const mysql = require('mysql2/promise');
const { mysqlConfig } = require('./config');

const pool = mysql.createPool(mysqlConfig);

console.log("Mysql is connected");

async function queryPromise(sql, params) {
    try {
        const result = await pool.query(sql, params)
        return result[0];
    } catch (error) {
        throw error;
    }
}

module.exports = {
    pool,
    queryPromise
};