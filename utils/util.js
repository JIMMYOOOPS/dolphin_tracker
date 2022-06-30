const multer = require('multer');
const path = require('path');
const port = process.env.PORT;

const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            const imageId = req.body.obv_id;
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
        return protocol + '://' + hostname + ':' + port + '/assets/' + productId + '/';
    } else {
        return protocol + '://' + hostname + '/assets/' + productId + '/';
    }
};

module.exports = {
    upload,
    getImagePath
};
