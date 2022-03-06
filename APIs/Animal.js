const AnimalModel = require('../Models/Animal');

const GetAnimalListHandler = async (req, res)=>{
    const docs = await AnimalModel.Animal.find();
    res.send(JSON.stringify(docs));
}

const GetAnimalByIdHandler = async (req, res)=>{
    const id = req.params.id;

    const doc = await AnimalModel.Animal.findById(id);
    if (doc){
        res.send(JSON.stringify(doc));
    }else{
        res.sendStatus(404);
    }
}

const PostAnimalHandler = async (req, res)=>{
    const newAnimal = AnimalModel.Animal({
        name: req.body.name,
        description: req.body.description,
        tags: req.body.tags,
        photoUrls: []
    })
    const result = await newAnimal.save();
    res.send(JSON.stringify(result));
}

module.exports = {
    GetAnimalListHandler,
    GetAnimalByIdHandler,
    PostAnimalHandler
}