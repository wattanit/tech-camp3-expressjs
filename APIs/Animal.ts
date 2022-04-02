import {Request, Response} from "express";
import fileUpload from "express-fileupload";

import {AnimalModel} from "../Models/Animal";

export const GetAnimalListHandler = async (req: Request, res: Response)=>{
    const docs = await AnimalModel.find();
    res.send(JSON.stringify(docs));
}

export const GetAnimalByIdHandler = async (req: Request<{id: string}>, res: Response)=>{
    const id = req.params.id;

    try{
        const doc = await AnimalModel.findById(id);
        if (doc){
            res.send(JSON.stringify(doc));
        }else{
            res.sendStatus(404);
        }
    }catch(err){
        res.sendStatus(400);
    }

}

export const PostAnimalHandler = async (req: Request, res: Response)=>{
    try{
        const newAnimal = new AnimalModel({
            name: req.body.name,
            description: req.body.description,
            tags: req.body.tags,
            photoUrls: '',
            adopted: false
        })
        const result = await newAnimal.save();
        res.send(JSON.stringify({
            id: result._id
        }));
    }catch (err){
        res.sendStatus(400);
    }

}

export const PutAnimalHandler = async (req: Request, res: Response)=>{
    try{
        const doc = await AnimalModel.findById(req.body.id);
        if (doc){
            if (req.body.name){
                doc.name = req.body.name;
            }
            if (req.body.description){
                doc.description = req.body.description;
            }
            if (req.body.tags){
                doc.description = req.body.tags;
            }
            if (req.body.adopted){
                doc.adopted = req.body.adopted;
            }
            await doc.save();
            res.sendStatus(200);
        }else{
            res.sendStatus(404);
        }
    }catch(err){
        res.sendStatus(400);
    }

}

export const UploadAnimalPhotoHandler = async (req: Request, res: Response)=>{
    try{
        if (!req.files){
            res.sendStatus(400);
        }else{
            let photo = req.files.photo as fileUpload.UploadedFile ;
            const photoUrl = "/photos/"+req.body.id+"/"+photo.name;

            const doc = await AnimalModel.findById(req.body.id)
            if(doc){
                await photo.mv("."+photoUrl);

                doc.photoUrls = photoUrl;

                await doc.save();
                res.sendStatus(201);
            }else{
                res.sendStatus(404);
            }
        }
    }catch (err){
        console.error(err);
        res.sendStatus(500);
    }
}