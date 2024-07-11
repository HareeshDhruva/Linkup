import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    require: true,
  },
  username: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
    min: 6,
  },
  gender: {
    type: String,
  },
  profilePhoto : {
    url:{
      type:String,
      default:null
    },
    public_id:{
      type:String,
      default:null
    }
  }
},{timestamps:true});

export const User = mongoose.model("User",userSchema);

