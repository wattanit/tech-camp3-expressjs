import express from "express";
import mongoose from "mongoose";
import fileUpload from "express-fileupload";
import passport from "passport";
import BearerStrategy from "passport-http-bearer";
import YAML from "yamljs";
import swaggerUi from "swagger-ui-express";

import {GetUserHandler, GetUsersList, PostUserHandler, PutUserHandler} from "./APIs/User";
import {
    GetAnimalByIdHandler,
    GetAnimalListHandler,
    PostAnimalHandler,
    PutAnimalHandler,
    UploadAnimalPhotoHandler
} from "./APIs/Animal";
import {LoginHandler, LogoutHandler} from "./APIs/Authentication";
import {SessionModel} from "./Models/Session";

//----------- Initialisation ---------------

const app = express();
const port = 4000;

const swaggerDocument = YAML.load('./swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(express.json());
app.use(fileUpload({
    createParentPath: true,
}))
app.use("/photos", express.static("photos"));


mongoose.connect('mongodb://localhost:27017/dogcatmatcher');

//------------- Initialise Bearer Authentication strategy-------
// @ts-ignore
const strategy = new BearerStrategy( async (token: string, done: any)=>{
    try{
        const session = await SessionModel.findOne({
            token: token
        });
        if (session){
            return done(null, session);
        }else{
            return done(null, false);
        }
    }catch (err){
        return done(err);
    }
})
passport.use(strategy);

//------------ API endpoints ----------------

app.get("/api/users", passport.authenticate('bearer', { session: false }), GetUsersList);
app.get("/api/user/:userId", passport.authenticate('bearer', { session: false }),GetUserHandler);
app.post("/api/user", PostUserHandler);
app.put("/api/user", passport.authenticate('bearer', { session: false }), PutUserHandler);

app.post("/api/login", LoginHandler);
app.post("/api/logout", passport.authenticate('bearer', { session: false }), LogoutHandler);

app.get("/api/animals", GetAnimalListHandler);
app.get("/api/animal/:id", GetAnimalByIdHandler);
app.post("/api/animal", passport.authenticate('bearer', { session: false }), PostAnimalHandler);
app.put("/api/animal", passport.authenticate('bearer', { session: false }), PutAnimalHandler);

app.post("/api/uploadPhoto", passport.authenticate('bearer', { session: false }), UploadAnimalPhotoHandler);

app.get("/api", (req, res)=>{
    res.send("Dog Cat Matcher API Server");
})

app.use("/", express.static("webapp"));

//------------ Start server -----------------
app.listen(port, ()=>{
    console.log("Server successfully started at "+port.toString());
})