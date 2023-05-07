const jwt = require('jsonwebtoken')

const verifyToken = async (req, res, next) => {

    try {
        const bearerToken = req.headers.authorization
        console.log(req.headers)
        if (bearerToken) {
            // need to split 'bearer' out of token
            const token = bearerToken.split(' ')[1];
            req.token = token;
            let decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
            // if token is less than current time, throw an error if true
            if (decoded.exp < Date.now()/1000) {
                throw {
                    status: 403,
                    message: "Token expired"
                }
            }
            req.decoded = decoded
            next()
        } else {
            throw {
                status: 403,
                message: "Forbidden"
            }
        }
} catch (error) {
        res.status(403).json("Invalid token")
}
}

module.exports = {
    verifyToken
}