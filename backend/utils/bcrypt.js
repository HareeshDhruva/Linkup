import bcrypt from "bcrypt"

export const hashing = async(userValue) =>{
    const salt = await bcrypt.genSalt(10);
    const hasedPassword = await bcrypt.hash(userValue,salt)
    return hasedPassword;
}
