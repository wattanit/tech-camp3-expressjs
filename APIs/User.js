const sha1 = require('sha1');
const UserModel = require('../Models/User');

const GetUserHandler = async function(req, res){
    console.log("Get /user ");
    console.log(req.params);

    const userName = req.params.name;

    // get user by name
    const doc = await UserModel.User.findOne({name: userName});
    console.log(doc)
    if (doc){
        res.send(JSON.stringify({
            id: doc._id,
            name: doc.name,
            email: doc.email,
        }));
    }else{
        res.sendStatus(404);
    }
}

const PostUserHandler = async function(req, res){
    console.log("POST /user ");
    console.log(req.body);
    console.log("Create a new user");
    // check for existing user
    const docs = await UserModel.User.find({name: req.body.name});
    console.log(docs)
    if (docs.length >0){
        res.sendStatus(403)
        return
    }else{
        // add new user to database
        const salt = Buffer.from(Math.random().toString()).toString("base64").substr(10, 5);

        const newUser = UserModel.User({
            name: req.body.name,
            email: req.body.email,
            hashPassword: sha1(req.body.password+salt),
            salt: salt
        })
        const result = await newUser.save(); // write to database here

        res.send(JSON.stringify({
            "result": "success",
            "userId": result._id.toString()
        }))
    }  
}

module.exports = {
    GetUserHandler,
    PostUserHandler
}