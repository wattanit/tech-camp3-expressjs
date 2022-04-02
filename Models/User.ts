import mongoose from "mongoose";

const schema = {
    name: String,
    email: String,
    hashPassword: String,
    salt: String,
    contact: String
}

export type UserType = {
    name: string,
    email: string,
    hashPassword: string,
    salt: string,
    contact: string
}

export const userSchema = new mongoose.Schema<UserType>(schema);

export const UserModel = mongoose.model("User", userSchema);
