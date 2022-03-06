const express = require("express");
const mongoose = require('mongoose');

const UserAPIs = require('./APIs/User');
const AnimalAPIs = require('./APIs/Animal');
const AuthenticationAPIs = require('./APIs/Authentication');

//----------- Initialisation -------------
const app = express();
const port = 4000;

app.use(express.json());
app.use(express.static("photos"));

mongoose.connect('mongodb://localhost:27017/dogcatmatcher');
  
//----------- API endpoints --------------

app.get("/user/:name", UserAPIs.GetUserHandler);
app.post("/user", UserAPIs.PostUserHandler);
app.put("/user", (req, res)=>{
    res.sendStatus(200)
})

app.post("/login", AuthenticationAPIs.LoginHandler);

app.get("/animal/:id", AnimalAPIs.GetAnimalByIdHandler);
app.post("/animal", AnimalAPIs.PostAnimalHandler);
app.get("/animalList", AnimalAPIs.GetAnimalListHandler);

app.get("/", (req, res)=>{
    console.log("Get / ");
    res.send("Dog Cat Matcher API Server");
})

//------------ Start server ----------------
app.listen(port, ()=>{
    console.log("Yeah! Server successfully started at "+port.toString());
})
