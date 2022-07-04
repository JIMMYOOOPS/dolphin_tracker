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
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            const data = req.body;
            let date = data.datepicker.split('/')
            let [year, month, day] = date;
            let boat_time = data.boat_time.replace(/:/g, '')
            let sailing_id = year + month + day + boat_time
            const imageId = sailing_id;
            const imagePath = path.join(__dirname, `../public/assets/${imageId}`);
            if (!fs.existsSync(imagePath)) {
                fs.mkdirSync(imagePath);
            }
            cb(null, imagePath);
        },
        filename: (req, file, cb) => {
            const fileName = Date.now() + '_' + file.originalname;
            cb(null, fileName);
        }
    })
});

const getImagePath = (protocol, hostname, productId) => {
    if (protocol == 'http') {
        return protocol + '://' + hostname + ':' + PORT + '/assets/' + productId + '/';
    } else {
        return protocol + '://' + hostname + '/assets/' + productId + '/';
    }
};

// UPLOAD FILE TO S3
async function uploadS3(file, location) {
try {
    let responseData = [];
    Object.values(file).map((item) => {
        const fileStream = fs.createReadStream(item[0].path);
        let params = {
          Bucket: AWS_BUCKET_NAME,
          Key: `images/${location}/${item[0].filename}`,
          Body: fileStream
        };
        responseData.push(params);
        if(responseData.length == file.length){
            return responseData;
        }
    })
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
                    console.log(user.role_id);
                } else if (roleId == User.USER_ROLE.KUROSHIO) {
                    userData = await User.getUserDetail(user.email, roleId, user.role_id);
                } else if (roleId == User.USER_ROLE.RECORDERS) {
                    userData = await User.getUserDetail(user.email, roleId, user.role_id);
                    console.log(userData)
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
