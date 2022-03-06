const sha1 = require('sha1');
const UserModel = require('../Models/User');

const LoginHandler = async (req, res)=>{
    console.log(req.body)
    const user = await UserModel.User.findOne({email: req.body.email});
    console.log(user)
    if(user){
        const hashPassword = user.hashPassword;
        const salt = user.salt;
        const attemptPassword = req.body.password
        if( sha1(attemptPassword+salt) == hashPassword){
            res.send({
                "message": "success",
                "token": sha1(JSON.stringify({
                    name: user.name,
                    email: user.email
                }))
            })
        }else{
            res.sendStatus(401)
        }
    }else{
        res.sendStatus(401)
    }
}

module.exports = {
    LoginHandler
}