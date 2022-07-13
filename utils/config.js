const path = require('path')
require('dotenv').config({path:__dirname+'/../.env'});
const S3 = require("aws-sdk/clients/s3");
const env = process.env.NODE_ENV || 'production';

const {NODE_ENV, DB_HOST, DB_USERNAME, DB_PASSWORD, DB_DATABASE, DB_DATABASE_TEST,
    CACHE_HOST, CACHE_PORT, CACHE_USER, CACHE_PASSWORD,
    ESRI_API_KEY, AWS_BUCKET_REGION, AWS_ACCESS_KEY, AWS_SECRET_KEY
} = process.env;

// Configure for MySQL
const mysqlConfig = {
    development: { // for RDS
        host: DB_HOST,
        user: DB_USERNAME,
        password: DB_PASSWORD,
        database: DB_DATABASE,
        waitForConnections: true,
        connectionLimit: 20,
    }, 
    test: { // for automation testing
        host: DB_HOST,
        user: DB_USERNAME,
        password: DB_PASSWORD,
        database: DB_DATABASE_TEST,
        waitForConnections: true,
        connectionLimit: 20
    }
};

    mysqlConfig[NODE_ENV];

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
};

// Configure for S3
const s3 = new S3({
    region: AWS_BUCKET_REGION,
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_KEY
  });

module.exports = {
    mysqlConfig,
    redisConfig,
    esriConfig,
    s3
};

