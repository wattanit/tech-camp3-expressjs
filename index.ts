import express from "express";
import mongoose from "mongoose";
import fileUpload from "express-fileupload";
import YAML from "yamljs";
import swaggerUi from "swagger-ui-express";

//----------- Initialisation ---------------

const app = express();
const port = 4000;

const swaggerDocument = YAML.load('./swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(express.json());
app.use(fileUpload({
    createParentPath: true,
}))
app.use(express.static("photos"));


mongoose.connect('mongodb://localhost:27017/dogcatmatcher');

//------------ API endpoints ----------------

app.get("/", (req, res)=>{
    res.send("Dog Cat Matcher API Server");
})

//------------ Start server -----------------
app.listen(port, ()=>{
    console.log("Server successfully started at "+port.toString());
})