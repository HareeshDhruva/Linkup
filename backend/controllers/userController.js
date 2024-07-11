import { User } from "../DB/usermodels.js";
import cloudinary from "cloudinary"

export const getUsers = async(req,res)=>{
    const loggedUser = req.user._id;
    const filteredUser = await User.find({_id:{$ne:loggedUser}}).select("-password");
    res.status(200).json(filteredUser);
}

export const updateProfilePhoto = async (req, res) => {
    try {
      const id = req.user._id;
      const { data } = req.body;
      if (!data) {
        return res.status(400).json({ message: "Provide all Fields" });
      }
      const user = await User.findOne({ _id: id });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      if (user.profilePhoto && user.profilePhoto.public_id) {
        await cloudinary.v2.api.delete_resources(user.profilePhoto.public_id);
      }
      user.profilePhoto = data;
      await user.save();
      res.status(200).json({ data: user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  export const getAdmin = async (req, res) => {
    const {_id} = req.user;
    const user = await User.findById({_id}).select("-password");
    if (user) {
      res.status(200).json({ data: user });
    } else {
      res.status(201).json({ message: "users not found" });
    }
  };