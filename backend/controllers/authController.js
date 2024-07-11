import { User } from "../DB/usermodels.js";
import tokengeneration from "../utils/jwt.js";
import { hashing } from "../utils/bcrypt.js";
import bcrypt from "bcrypt";

export const register = async (req, res) => {
  const { fullname, email, password, gender } = req.body;
  if (!fullname || !email || !password || !gender) {
    return res.status(201).json({ message: "Provide all Fields" });
  }

  try {
    const ExistUser = await User.findOne({ email });
    if (ExistUser) {
      return res.status(201).json({ message: "Email Already Exist" });
    }
    const hasedPassword = await hashing(password);
    const user = await User.create({
      fullname,
      email: email.toLowerCase(),
      gender,
      password: hasedPassword,
    });
    user.save();
    tokengeneration(user._id, res);
    res.status(200).json({ data: user ,message: "register successfully" });
  } catch (err) {
    res.status(201).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(201).json({ message: "Enter Email And Password" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(201).json({ message: "User Not Exist" });
    }
    const validPass = bcrypt.compare(password, user.password);

    if (!validPass) {
      return res.status(500).json({ message: "Incorrect Password" });
    }
    tokengeneration(user._id, res);
    res.status(200).json({ data: user ,message: "login successfully" });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

export const logout = (req, res) => {
  try {
    console.log("response");
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "logout successfully" });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};
