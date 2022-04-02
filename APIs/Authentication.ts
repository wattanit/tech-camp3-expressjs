import sha1 from "sha1";
import {Request, Response} from "express";
import {UserModel} from "../Models/User";
import {SessionModel} from "../Models/Session";

export const LoginHandler = async (req: Request, res: Response)=>{
    try{
        console.log(req.body)
        const user = await UserModel.findOne({email: req.body.email});
        console.log(user)
        if(user){
            const hashPassword = user.hashPassword;
            const salt = user.salt;
            const attemptPassword = req.body.password
            if( sha1(attemptPassword+salt) == hashPassword){

                const userId = user._id;
                const token = sha1(JSON.stringify({
                    name: user.name,
                    email: user.email,
                    secret: "lovely shabu"
                }))

                const session = new SessionModel({
                    userId: userId,
                    token: token
                })

                const result = await session.save();

                res.send(JSON.stringify({
                    "sessionId": result._id,
                    "userId": userId,
                    "token": token
                }))
            }else{
                res.sendStatus(401)
            }
        }else{
            res.sendStatus(401)
        }
    }catch (err){
        res.sendStatus(400);
    }
}

export const LogoutHandler = async (req: Request, res: Response)=>{
    try{
        const session = await SessionModel.findById(req.body.sessionId);
        if (session){
            await session.deleteOne();
            res.sendStatus(200);
        }else{
            res.sendStatus(401);
        }
    }catch (err){
        res.sendStatus(400);
    }
}