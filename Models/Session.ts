import mongoose from "mongoose";

const schema = {
    userId: String,
    token: String
}
export type SessionType = {
    userId: string,
    token: string
}

export const sessionSchema = new mongoose.Schema<SessionType>(schema);

export const SessionModel = mongoose.model("Session", sessionSchema);