const path = require('path')
require('dotenv').config({path:__dirname+'/../.env'});

const { DB_HOST, DB_USERNAME, DB_PASSWORD, DB_DATABASE, 
    CACHE_HOST, CACHE_PORT, CACHE_USER, CACHE_PASSWORD,
    ESRI_API_KEY
} = process.env;

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

// Configure for ArcGIS
const esriConfig = {
    apiKey: ESRI_API_KEY
}

module.exports = {
    mysqlConfig,
    redisConfig,
    esriConfig
};

