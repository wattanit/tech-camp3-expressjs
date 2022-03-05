const express = require("express");
const mongoose = require('mongoose');
const sha1 = require('sha1');

const app = express();
const port = 4000;

app.use(express.json());
app.use(express.static("photos"));

mongoose.connect('mongodb://localhost:27017/dogcatmatcher');
  

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    hashPassword: String,
    salt: String
});

const User = mongoose.model("User", userSchema);

const animalSchema = new mongoose.Schema({
    name: String,
    description: String,
    photoUrls: [String],
    tags: [String]
})

const Animal = mongoose.model("Animal", animalSchema);


app.get("/user/:name", async (req, res)=>{
    console.log("Get /user ");
    console.log(req.params);

    const userName = req.params.name;

    // get user by name
    const doc = await User.findOne({name: userName});
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
})

    
app.post("/user", async (req, res)=>{
    console.log("POST /user ");
    console.log(req.body);
    console.log("Create a new user");
    // check for existing user
    const docs = await User.find({name: req.body.name});
    console.log(docs)
    if (docs.length >0){
        res.sendStatus(403)
        return
    }else{
        // add new user to database
        const salt = Buffer.from(Math.random().toString()).toString("base64").substr(10, 5);

        const newUser = User({
            name: req.body.name,
            email: req.body.email,
            hashPassword: sha1(req.body.password+salt),
            salt: salt
        })
        await newUser.save(); // write to database here

        res.send(JSON.stringify({
            "result": "success",
            "userId": "ID"
        }))
    }    
})

app.put("/user", (req, res)=>{
    res.sendStatus(200)
})

app.post("/login", async (req, res)=>{
    console.log(req.body)
    const user = await User.findOne({email: req.body.email});
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
})

app.get("/animal/:id", async (req, res)=>{
    const id = req.params.id;

    const doc = await Animal.findById(id);
    if (doc){
        res.send(JSON.stringify(doc));
    }else{
        res.sendStatus(404);
    }
})

app.post("/animal", async (req, res)=>{
    const newAnimal = Animal({
        name: req.body.name,
        description: req.body.description,
        tags: req.body.tags,
        photoUrls: []
    })
    const result = await newAnimal.save();
    res.send(JSON.stringify(result));
});

app.get("/animalList", async (req, res)=>{
    const docs = await Animal.find();
    res.send(JSON.stringify(docs));
})

app.get("/", (req, res)=>{
    console.log("Get / ");
    res.send("Hello world!");
})

app.listen(port, ()=>{
    console.log("Yeah! Server successfully started at "+port.toString());
})
