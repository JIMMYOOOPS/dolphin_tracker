const bcrypt = require('bcrypt');
const {queryPromise} = require('../../utils/mysql');
const salt = parseInt(process.env.BCRYPT_SALT);
const {TOKEN_EXPIRE, TOKEN_SECRET} = process.env;
const jwt = require('jsonwebtoken');

const USER_ROLE = {
  ADMIN: -1,
  KUROSHIO: 1,
  RECORDERS: 2, // Default Role
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
      signup_at: signupDate,
    };
    const accessToken = jwt.sign({
      role_id: user.role_id,
      name: user.name,
      email: user.email,
      picture: user.picture,
    }, TOKEN_SECRET);
    user.access_token = accessToken;

    const sqlCreateUser = 'INSERT INTO user SET ?';
    const result = await queryPromise(sqlCreateUser, user);
    user.id = result.insertId;
    return user;
  } catch (error) {
    return {
      error: 'Email Already Exists',
      status: 403,
    };
  }
};

const userLogin = async (email, password) => {
  try {
    const sqlLoginUser = 'SELECT * FROM user WHERE email = ?';
    const [result] = await queryPromise(sqlLoginUser, [email]);
    if (!result) {
      return null;
    }
    const user = result;
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      return {error: 'Password is wrong'};
    }

    const loginAt = new Date(); // Track user previous login time
    const accessToken = jwt.sign({
      role_id: user.role_id,
      name: user.name,
      email: user.email,
      picture: user.picture,
    }, TOKEN_SECRET);

    const sqlLoginStatus = 'UPDATE user SET access_token = ?, access_expired = ?, login_at = ? WHERE id = ?';
    await queryPromise(sqlLoginStatus, [accessToken, TOKEN_EXPIRE, loginAt, user.id]);
    user.access_token = accessToken;
    user.login_at = loginAt;
    user.access_expired = TOKEN_EXPIRE;
    return user;
  } catch (error) {
    return error;
  }
};

const getUserDetail = async (email, roleId, userRoleId) => {
  try {
    if (roleId == USER_ROLE.ADMIN) {
      if (userRoleId == USER_ROLE.ADMIN) {
        const user = await queryPromise('SELECT * FROM user WHERE email = ? AND role_id = ?', [email, roleId]);
        return user;
      }
    } else if (roleId == USER_ROLE.KUROSHIO) {
      if (userRoleId == USER_ROLE.ADMIN) {
        const user = await queryPromise('SELECT * FROM user WHERE email = ? AND role_id = ?', [email, userRoleId]);
        return user;
      } else {
        const user = await queryPromise('SELECT * FROM user WHERE email = ? AND role_id = ?', [email, roleId]);
        return user;
      }
    } else if (roleId == USER_ROLE.RECORDERS) {
      if (userRoleId == USER_ROLE.ADMIN) {
        const user = await queryPromise('SELECT * FROM user WHERE email = ? AND role_id = ?', [email, userRoleId]);
        return user;
      } else if (userRoleId == USER_ROLE.KUROSHIO) {
        const user = await queryPromise('SELECT * FROM user WHERE email = ? AND role_id = ?', [email, userRoleId]);
        return user;
      } else {
        const user = await queryPromise('SELECT * FROM user WHERE email = ? AND role_id = ?', [email, roleId]);
        return user;
      }
    }
  } catch (error) {
    return error;
  }
};

const getUsers = async () => {
  try {
    const result = await queryPromise('SELECT name, email, role_id, picture, login_at FROM user');
    return result;
  } catch (error) {
    return error;
  }
};

const validateUserLogin = async (email) => {
  try {
    const result = await queryPromise('SELECT * FROM user WHERE email = ?', [email]);
    return result;
  } catch (error) {
    return error;
  }
};

const updateUsers = async (email, role_id) => {
  try {
    console.log(role_id);
    const user = await queryPromise('UPDATE user SET role_id = ? WHERE email = ?', [role_id, email]);
    return user;
  } catch (error) {
    return error;
  }
};

const deleteUsers = async (email) => {
  try {
    const user = await queryPromise('DELETE FROM user WHERE email = ?', [email]);
    return user;
  } catch (error) {
    return error;
  }
};

module.exports = {
  USER_ROLE,
  userSignup,
  userLogin,
  getUserDetail,
  getUsers,
  validateUserLogin,
  updateUsers,
  deleteUsers,
};
