require('dotenv').config();
const mysql = require('mysql2/promise');
const {DB_HOST, DB_USERNAME, DB_PASSWORD, DB_DATABASE, 
    CACHE_HOST, CACHE_PORT, CACHE_USER, CACHE_PASSWORD} = process.env;

// Configure for MySQL
const mysqlConfig = {
        host: DB_HOST,
        user: DB_USERNAME,
        password: DB_PASSWORD,
        database: DB_DATABASE,
        waitForConnections: true,
        connectionLimit: 20,
        queueLimit: 0
};

// Configure for Redis
const redisConfig = {
    url: `redis://${CACHE_USER}:${CACHE_PASSWORD}@${CACHE_HOST}:${CACHE_PORT}`,
    socket: {
        keepAlive: false
    }
}


module.exports = {
    mysqlConfig,
    redisConfig
};

