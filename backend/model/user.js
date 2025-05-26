import mongoose from 'mongoose';
const {Schema,model} = mongoose;

const userSchema = new Schema(
    {
        userName:{
            type:String,
            required:true,
            unique:true
        },
        passWord:{
            type:String,
            required:true,
        },
    },
    {
        timestamps:true
    }
)

export const userModel = model("User",userSchema)