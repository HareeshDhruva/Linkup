import mongoose from "mongoose";

export const connection = async(url)=>{
    try{
        const connect = await mongoose.connect(url);
        if(connect){
            console.log("connected");
        }
        else{
            console.log("failed");
        }
    }
    catch(error){
        console.log(error);
    }
}