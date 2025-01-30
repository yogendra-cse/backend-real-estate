
 import mongoose from "mongoose";
 
 const userSchema = new mongoose.Schema({
   email: { type: String, unique: true, required: true },
   username: { type: String, unique: true, required: true },
   password: { type: String, required: true },
   avatar: { type: String },
   createdAt: { type: Date, default: Date.now },
 });
 
 const user = mongoose.model('user', userSchema);
 export default user;
 