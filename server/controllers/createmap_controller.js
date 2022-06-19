const path = require('path')
require('dotenv').config({path:__dirname+'/../.env'});

function track (req, res) {
    res.sendFile(path.join(__dirname, '../../', 'public', 'track.html'))
}

module.exports = {
    track
}

