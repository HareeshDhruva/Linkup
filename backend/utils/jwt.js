import jwt from "jsonwebtoken";
const tokengeneration = (userId, res) => {
  try {
    const token = jwt.sign({ userId }, process.env.SECRECT, { expiresIn: "15d" });
    const maxAge = 15 * 24 * 60 * 60 * 1000;
    res.cookie("jwt", token, {
      path: "/",
      maxAge,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
    });
  } catch (error) {
    console.error("Error generating token:", error);
    res.status(500).send("Internal Server Error");
  }
};

export default tokengeneration;
