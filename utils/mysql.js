const mysql = require('mysql2/promise');
const { mysqlConfig } = require('./config');

const pool = mysql.createPool(mysqlConfig);
console.log('Mysql is connected');

async function queryPromise(sql, params) {
    try {
        const result = await pool.query(sql, params)
        return result[0];
    } catch (error) {
        throw error;
    }
}

async function createInBulk (sql, params) {
    const conn = await pool.getConnection();
    try {
        await conn.query('START TRANSACTION');
        await conn.query(sql, [params]);
        await conn.query('COMMIT');
        return true;
    } catch (error) {
        await conn.query('ROLLBACK');
        console.log(error)
        return { error };
    } finally {
        conn.release();
    }
};

async function poolConnection () {
    await pool.getConnection()
}

async function poolRelease () {
    await pool.end()
}

module.exports = {
    pool,
    queryPromise,
    createInBulk,
    poolConnection,
    poolRelease
};