const User = require('../model/User')
const { errorHandler, createUser, hashPassword, comparePassword, createJWTToken } = require('./userHelper')

module.exports = {
    login: async (req, res) => {
        try {
            // foundUser is the user obj from the database
            let foundUser = await User.findOne({
                username: req.body.username
            })
            // if not found with returned undefined 
            if (!foundUser) {
                // could also return
                throw {
                    status: 404,
                    message: "User does not exist"
                }
            }
            //throw an error if password from frontend doesnt match db password
            console.log(foundUser)
            let comparedPassword = await comparePassword(req.body.password, foundUser.password)
            if (!comparedPassword) {
                throw {
                    status: 401,
                    message: 'Password doesnt match.'
                }
            }

            //JWT: 
            let token = await createJWTToken(foundUser)

            // let username = req.body.username
            // let password = req.body.password
            // console.log(username,password)
            // if (username === "Darriel") {
            //     throw new Error("This user exists")
            // }
            res.status(200).json({
                message: 'Post request from the controller',
                userObj: foundUser,
                token: token
              })

        } catch (error) {
            let errorMessage = await errorHandler(error)
            res.status(errorMessage.status).json({
                message: errorMessage.message
              });
        }
    },
    register: async (req, res) => {
        try {
            let foundUser = await User.findOne({
                username: req.body.username
            })
            if (foundUser) {
                // could also return
                throw {
                    status: 409,
                    message: "User exists"
                }
            }
            // let newUser = await new User({
            //     username: req.body.username,
            //     password: req.body.password
            // });
            //console.log(newUser);
            let newUser = await createUser(req.body);
                // password hash:
            let hashedPassword = await hashPassword(newUser.password)
                //  add hashed pass to new User:
            newUser.password = hashedPassword
                //  save newUser: 
            let savedUser = await newUser.save()
            
            res.status(200).json({
                message: 'Success! User created.',
                userObj: savedUser
              });
        } 
        catch (error) {
            let errorMessage = await errorHandler(error)
            res.status(errorMessage.status).json({
                message: errorMessage.message
              })
        }
    },
    deleteUser: async (req, res) => {
        try {
            console.log(req.token)
            let deletedUser = await User.deleteOne(req.body)
            if (deletedUser.deletedCount > 0){
                res.status(200).json({
                message: "User deleted."
            })
            } else {
                throw {
                    status: 404,
                    message: 'User not deleted.'
                }
            }
        
        } catch (error) {
            let errorMessage = await errorHandler(error)
            res.status(errorMessage.status).json({
                message: errorMessage.message
              })
        }
    },
    authToken: async (req, res) => {
        try {
            let foundUser = await User.findById(req.decoded.id)
            console.log(foundUser);

            res.status(200).json(foundUser)

        } catch (error) {
            let errorMessage = await errorHandler(error)
            res.status(errorMessage.status).json({
                message: errorMessage.message
              })
        }
    }
}
