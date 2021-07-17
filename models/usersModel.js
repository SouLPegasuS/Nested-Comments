import { Schema, model } from 'mongoose';

const userSchema = Schema({
    name : {
        type: String,
        unique: true,
        required: true,
    },
    password : {
        type: String,
        required: true
    }
}, {timestamps: true});



const User = new model("User", userSchema);

export default User;