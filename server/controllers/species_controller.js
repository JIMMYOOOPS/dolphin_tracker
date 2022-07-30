const path = require('path');

function species(req, res) {
  res.sendFile(path.join(__dirname, '../../', 'public', 'species_detail.html'));
}

module.exports = {
  species,
};
