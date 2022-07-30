const path = require('path');
require('dotenv').config({path: __dirname+'/../.env'});

function tracker(req, res) {
  res.sendFile(path.join(__dirname, '../../', 'public', 'tracker.html'));
}

module.exports = {
  tracker,
};

