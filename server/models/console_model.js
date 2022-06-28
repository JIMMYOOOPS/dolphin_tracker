const bcrypt = require('bcrypt');
const got = require('got'); //??
const { queryPromise } = require('../../utils/mysql');
const salt = parseInt(process.env.BCRYPT_SALT);
const {TOKEN_EXPIRE, TOKEN_SECRET} = process.env; // 30 days by seconds
const jwt = require('jsonwebtoken');

const USER_ROLE = {
    ALL: -1,
    KUROSHIO: 1,
    RECORDERS: 2 //Default Role
};

const userSignup = async (name, roleId, email, password) => {
    try {
        const signupDate = new Date();
        const user = {
            role_id: roleId,
            email: email,
            password: bcrypt.hashSync(password, salt),
            name: name,
            picture: null,
            access_expired: TOKEN_EXPIRE,
            signup_at: signupDate
        };
        const accessToken = jwt.sign({
            name: user.name,
            email: user.email,
            picture: user.picture
        }, TOKEN_SECRET);
        user.access_token = accessToken;

        const sqlCreateUser = 'INSERT INTO user SET ?';
        const result = await queryPromise(sqlCreateUser, user);
        user.id = result.insertId;
        return user;
    } catch (error) {
        return {
            error: 'Email Already Exists',
            status: 403
        };
    }
}

const userLogin = async (email, password) => {
    try {
        let sqlLoginUser = 'SELECT * FROM user WHERE email = ?'
        let [result] = await queryPromise(sqlLoginUser, [email]);
        if (!result) {
            return null
        }
        let user = result;
        if (!bcrypt.compare(password, user.password)){
            return {error: 'Password is wrong'};
        }

        //Track user previous login time
        const loginAt = new Date();
        const accessToken = jwt.sign({
            name: user.name,
            email: user.email,
            picture: user.picture
        }, TOKEN_SECRET);
        
        let sqlLoginStatus = 'UPDATE user SET access_token = ?, access_expired = ?, login_at = ? WHERE id = ?';
        await queryPromise(sqlLoginStatus, [accessToken, TOKEN_EXPIRE, loginAt, user.id]);
        user.access_token = accessToken;
        user.login_at = loginAt;
        user.access_expired = TOKEN_EXPIRE;
        return user;
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    userSignup,
    userLogin
}