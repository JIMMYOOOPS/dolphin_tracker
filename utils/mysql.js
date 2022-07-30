const mysql = require('mysql2/promise');
const {mysqlConfig} = require('./config');
require('dotenv').config({path: __dirname+'/../.env'});
const {NODE_ENV} = process.env;

const pool = mysql.createPool(mysqlConfig[NODE_ENV]);
console.log('Mysql is connected');

async function queryPromise(sql, params) {
  try {
    const result = await pool.query(sql, params);
    return result[0];
  } catch (error) {
    throw error;
  }
}

async function createInBulk(sql, params) {
  const conn = await pool.getConnection();
  try {
    await conn.query('START TRANSACTION');
    await conn.query(sql, [params]);
    await conn.query('COMMIT');
    return true;
  } catch (error) {
    await conn.query('ROLLBACK');
    console.log(error);
    return {error};
  } finally {
    conn.release();
  }
};

async function poolConnection() {
  const conn = await pool.getConnection();
  return conn;
}

async function poolRelease() {
  await pool.end();
}

module.exports = {
  pool,
  queryPromise,
  createInBulk,
  poolConnection,
  poolRelease,
};
