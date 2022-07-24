require('dotenv').config();
const req = require("express/lib/request");
const Config = require('./config')
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const User = require('../server/models/console_model');
const {PORT, AWS_BUCKET_NAME, TOKEN_SECRET} = process.env;

// Upload files to local
const upload = multer({
    storage: multer.memoryStorage({
        filename: (req, file, cb) => {
            const fileName = Date.now() + '_' + file.originalname;
            cb(null, fileName);
        }
    })
});

const getImagePath = (protocol, hostname, imageId) => {
    if (protocol == 'http') {
        return protocol + '://' + hostname + ':' + PORT + '/assets/' + imageId + '/';
    } else {
        return protocol + '://' + hostname + '/assets/' + imageId + '/';
    }
};

// UPLOAD FILE TO S3
async function uploadS3(file, location) {
try {
    const params = Object.values(file).map((item) => {
        let base64data = Buffer.from(item[0].buffer, 'binary');
        let currentDate = new Date().toISOString().split('T')[0];
        return {
            Bucket: AWS_BUCKET_NAME,
            Key: `images/${location}/${currentDate + '_' + item[0].fieldname}`,
            Body: base64data
          };
    })
    const result = await Promise.all(params.map(item => Config.s3.upload(item).promise()))
    return result;
    } catch (error) {
        return {"error": true, "Message": error}
    }
}

// Authentication for entering console pages with jwt
const authentication = (roleId) => {
    return async function (req, res, next) {
        let accessToken = req.get('Authorization')
        if(!accessToken) {
            res.status(401).json({message: 'Please login before entering this page.'})
            return;
        }
        accessToken = accessToken.replace('Bearer ', '');
        if (accessToken == null) {
            res.status(401).json({message: 'Please login before entering this page.'})
        }
        try {
            const user = await new Promise(
                function (resolve,reject) {
                    jwt.verify(accessToken, TOKEN_SECRET, (err, user) =>{
                        if (err) {
                            reject(err);
                        } 
                        resolve(user);
                    });
                }
            )
            req.user = user;
            if (roleId == null) {
                next()
            } else {
                let userData; 
                if (roleId == User.USER_ROLE.ADMIN) {
                    userData = await User.getUserDetail(user.email, roleId, user.role_id);
                } else if (roleId == User.USER_ROLE.KUROSHIO) {
                    userData = await User.getUserDetail(user.email, roleId, user.role_id);
                } else if (roleId == User.USER_ROLE.RECORDERS) {
                    userData = await User.getUserDetail(user.email, roleId, user.role_id);
                }
                if (userData[0] == null) {
                    res.status(403).json({message: 'You are Forbidden to enter this page'});
                } else {
                    req.user.id = userData.id;
                    req.user.role_id = userData.role_id;
                    next();
                }
            }
            return;
        } catch(error) {
            res.status(403).json({message: 'You are Forbidden to enter this page'});
            return;
        }
    }
}

module.exports = {
    upload,
    uploadS3,
    getImagePath,
    authentication
};
