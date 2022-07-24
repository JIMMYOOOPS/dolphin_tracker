const path = require('path');
const validator = require('validator');
const Console = require('../models/console_model');
const jwt = require('jsonwebtoken');
const {TOKEN_SECRET} = process.env;
require('dotenv').config();

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

function getUsersPage (req, res) {
    res.sendFile(path.join(__dirname, '../../', 'public', 'console_users.html'))
}

async function userSignup (req, res) {
    try {
        const {name, email, password} = req.body;
        // Validate user info
        if (!validator.isEmail(email)) {
            res.status(400).send({error:'Request Error: Invalid email format'});
            return;
        }
        if(!name || !email || !password ) {
            res.status(400).send({error:'Request Error: Missing fields in name, email or password.'});
        }
        function validateUserInfo (userInfo) {
            if (!validator.matches(userInfo, '^[a-zA-Z0-9]*$')) {
                res.status(400).send({error:'Username or Password includes invalid characters'});
            } 
            if (!validator.isLength(userInfo, {min:4, max: 12})) {
                res.status(400).send({error:'Username or Password length should be between 4 to 12 letters'});
            }
        }
        validateUserInfo(name);
        validateUserInfo(password);
        // Set role_id for user default as 2
        const result = await Console.userSignup(name, 2, email, password);
        res.status(200).json(result);
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(403).json('The email has been registered!')
        }
    }
}

async function userLogin (req, res) {
    let {email, password} = req.body
    if(!email || !password){
        res.status(400).json({error: 'Request Error: email and password are required.'});
    }
    try {
        let user = await Console.userLogin(email, password);
        if (user == null) {
            res.status(400).json({error: 'Account does not exist.'});
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
            throw error
    }
}

async function updateUsers (req, res) {
    try {
        let {email, role_id} = req.body;
        console.log(role_id);
        let result = await Console.updateUsers(email, role_id);
        console.log(result)
        if (result.changedRows === 0) {
            res.status(400).json({
                error: 'User information has NOT been updated.'
            });    
        } else {
            res.status(200).json({
                success: 'User information is updated.'
            });
        }
    } catch (error) {
        throw error
    }
}

async function getUsers (req, res) {
    try {
        let data = await Console.getUsers();
        let result = {}
        function validateLastLoginDate(data) {
            let loginAt = [];
            for (i=0; i<data.length; i++) {
                if (data[i].login_at == null) {
                    loginAt.push('未登入過')
                } else {
                    loginAtArray = data[i].login_at.split(' ') 
                    loginAt.push(loginAtArray[0])
                } 
            }
            for(i=0; i<loginAt.length; i++) {
                data[i].login_at = loginAt[i]
            }
            return data;
        }
        let updatedData = validateLastLoginDate(data)
        result = {
            data: updatedData
        }
        res.status(200).json(result);   
    } catch (error) {
        throw error
    }
}

async function getUser (req, res) {
    try {
        let accessToken = req.get('Authorization')
        accessToken = accessToken.replace('Bearer ', '');
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
        let result = await Console.getUser(user.email);
        res.status(200).json(result); 
    } catch(error) {
        if (!accessToken) {
            res.status(403).json({message: 'You are Forbidden to enter this page'});
        }
        throw error
    }
}

async function deleteUsers (req, res) {
    try {
        let {email} = req.body;
        let result = await Console.deleteUsers(email);
        if (result.affectedRows === 0) {
            res.status(200).json({
                fail: 'User information has NOT been deleted.'
            });    
        } else {
            res.status(200).json({
                success: 'User information has been deleted.'
            });
        }
    } catch (error) {
        res.status(500).json({
            error: console.log(error),
            message: 'An error has occured on the server'
        })
    }
}

module.exports = {
    sightingPage,
    dataBasePage,
    webConsole,
    webConsolePage,
    userSignup,
    userLogin,
    getUsersPage,
    getUsers,
    getUser,
    updateUsers,
    deleteUsers
}