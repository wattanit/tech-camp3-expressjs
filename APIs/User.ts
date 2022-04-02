import sha1 from "sha1";
import { Request, Response } from "express";

import {UserModel} from "../Models/User";

export const GetUserHandler = async function(req: Request<{userId: string}>, res: Response){
    console.log("Get /user ");
    console.log(req.params);

    const userId = req.params.userId;

    try {
        // get user by name
        const doc = await UserModel.findById(userId);
        console.log(doc)
        if (doc) {
            res.send(JSON.stringify({
                id: doc._id,
                name: doc.name,
                email: doc.email,
                contact: doc.contact
            }));
        } else {
            res.sendStatus(404);
        }
    }catch (err){
        res.sendStatus(400);
    }
}

export const PostUserHandler = async function(req: Request, res: Response){
    console.log("POST /user ");
    console.log(req.body);
    console.log("Create a new user");
    try {
        // check for existing user
        const docs = await UserModel.find({name: req.body.name});
        console.log(docs)
        if (docs.length > 0) {
            res.sendStatus(403)
            return
        } else {
            // add new user to database
            const salt = Buffer.from(Math.random().toString()).toString("base64").substring(10, 15);

            const newUser = new UserModel({
                name: req.body.name,
                email: req.body.email,
                hashPassword: sha1(req.body.password + salt),
                salt: salt,
                contact: req.body.contact
            })
            const result = await newUser.save(); // write to database here

            res.send(JSON.stringify({
                "result": "success",
                "userId": result._id.toString()
            }))
        }
    }catch (err){
        res.sendStatus(400);
    }
}

export const PutUserHandler = async function(req: Request, res: Response){
    console.log("PUT /user");
    console.log(req.body);
    console.log("Update a user");

    try {
        const doc = await UserModel.findById(req.body.id);
        if (doc) {
            if (req.body.name) {
                doc.name = req.body.name;
            }
            if (req.body.contact) {
                doc.contact = req.body.contact;
            }
            await doc.save();
            res.sendStatus(200);

        } else {
            res.sendStatus(404);
        }
    }catch(err){
        res.sendStatus(400);
    }
}

export const GetUsersList = async function(req: Request, res: Response){
    const docs = await UserModel.find().exec();
    const userList = docs.map(doc=>{
        return {
            id: doc._id,
            email: doc.email,
            name: doc.name,
            contact: doc.contact
        }
    })
    res.send(JSON.stringify(userList))
}