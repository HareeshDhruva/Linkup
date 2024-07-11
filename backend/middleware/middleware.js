import jwt from "jsonwebtoken";
import { User } from "../DB/usermodels.js";

export const protectRoute = async(req, res, next)=>{
    try{
        const token = req.cookies.jwt;
        if(!token){
            res.statu(401).json({error:"Unauthorized - No Token Provided"});
        }
        else{
            const decoded = jwt.verify(token,process.env.SECRECT);
            if(!decoded)return res.statu(401).json({message:"Unauthorized - Invalid Token Provided"});
            const user = await User.findById({_id:decoded.userId}).select("-password");
            if(!user) return res.statu(401).json({message:"User not fount"});
            req.user = user;
            next();
        }
    }
    catch(error){
        return res.status(500).json({message:error})
    }
}