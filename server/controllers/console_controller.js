const path = require('path');
const validator = require('validator');
const Console = require('../models/console_model');

function webConsole (req, res) {
    res.sendFile(path.join(__dirname, '../../', 'public', 'console_login.html'));
};

function webConsolePage (req, res) {
    res.sendFile(path.join(__dirname, '../../', 'public', 'console.html'));
};

function sightingPage (req, res) {
    res.sendFile(path.join(__dirname, '../../', 'public', 'console_sighting.html'))
}

function dataBasePage (req, res) {
    res.sendFile(path.join(__dirname, '../../', 'public', 'console_db.html'))
}

function usersPage (req, res) {
    res.sendFile(path.join(__dirname, '../../', 'public', 'console_users.html'))
}

async function userSignup (req, res) {
    try {
        const {name, email, password} = req.body;
        if(!name || !email || !password) {
            res.status(400).send({error:'Request Error: Missing fields in name, email or password.'});
            return;
        }
    
        if (!validator.isEmail(email)) {
            res.status(400).send({error:'Request Error: Invalid email format'});
            return;
        }
    
        // Set role_id for user default as 2
        const result = await Console.userSignup(name, 2, email, password);
        res.status(200).json(result);
    } catch (error) {
        if (err.code === 'ER_DUP_ENTRY') {
            res.status(403).json('The email has been registered!')
        } else {
            console.log(error)
        }
    }
}

async function userLogin (req, res) {
    let {email, password} = req.body
    if(!email || !password){
        return {error: 'Request Error: email and password are required.', status: 400};
    }
    try {
        let user = await Console.userLogin(email, password);
        if (user == null) {
            res.status(200).json({error: 'Account does not exist.'});
        }
        let data = {};
        data = {
            access_token: user.access_token,
            access_expired: user.access_expired,
            login_at: user.login_at,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                picture: user.picture,
                role_id: user.role_id
            }
        }
        res.status(200).json(data);
    } catch (error) {
            console.log(error)
    }
}

module.exports = {
    sightingPage,
    dataBasePage,
    webConsole,
    webConsolePage,
    userSignup,
    userLogin,
    usersPage
}

