const mongoose = require('mongoose');

const animalSchema = new mongoose.Schema({
    name: String,
    description: String,
    photoUrls: [String],
    tags: [String]
})

const Animal = mongoose.model("Animal", animalSchema);

module.exports = {
    animalSchema,
    Animal
}