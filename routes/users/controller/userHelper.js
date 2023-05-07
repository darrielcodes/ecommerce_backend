const bcrypt = require('bcrypt');
const User = require('../model/User')
const jwt = require('jsonwebtoken');

const createUser = async (user) => {
    let newUser = await new User({
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        password: user.password
    })
    return newUser 
};

const saltRounds = 10;

const hashPassword = async (password) => {
    let genSalt = await bcrypt.genSalt(saltRounds);
    let hashedPassword = await bcrypt.hash(password, genSalt)
    return hashedPassword
};

const comparePassword = async (reqPassword, dbPassword) => {
    let comparedPassword = await bcrypt.compare(reqPassword, dbPassword);
    return comparedPassword 
};

const errorHandler = async (err) => {

    return {
        status: err.status,
        message: err.message
    }
};

const createJWTToken = async (foundUser) => {
    //payload is data that will be sent into headers, dont do too much. never put passwords here.
    let payload = {
        id: foundUser._id,
        username: foundUser.username
    };
    let token = await jwt.sign(payload, process.env.JWT_SECRET_KEY, {expiresIn: 5 * 60 });
    // 5 * 60 is 5 mins, can set whatever time here.
    //takes payload and assigns an encoded token, then returns
    return token
}

module.exports = {
    errorHandler,
    createUser,
    hashPassword,
    comparePassword,
    createJWTToken
}