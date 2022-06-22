const path = require('path')

function console (req, res) {
    res.sendFile(path.join(__dirname, '../../', 'public', 'console.html'))
}

function consoleLogin (req, res) {
    res.sendFile(path.join(__dirname, '../../', 'public', 'consolelogin.html'))
}

module.exports = {
    console,
    consoleLogin
}

