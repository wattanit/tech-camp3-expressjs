import mongoose from "mongoose";

const schema = {
    name: String,
    description: String,
    photoUrls: String,
    tags: [String],
    adopted: Boolean
}

export type AnimalType = {
    name: string,
    description: string,
    photoUrls: string,
    tags: [string],
    adopted: boolean
};

export const animalSchema = new mongoose.Schema<AnimalType>(schema);

export const AnimalModel = mongoose.model("Animal", animalSchema);
