/*package imports*/
import express from "express";
import  dotenv  from "dotenv";
import bodyparser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import {v2 as cloudinary} from "cloudinary"

/*module imports*/
import authRoute from "./router/auth.js";
import messageRoute from "./router/message.js";
import userRoute from "./router/users.js";
import { connection } from "./DB/connection.js";
import { server, app } from "./socket/socket.js";
import updateRouter from "./router/profile.js"
import path from 'path';

/* Load environment variables */
dotenv.config();
/* Connect to MongoDB */
connection(process.env.MONGODB_URI);
/*connect cloudinary*/
const CLOUDINARY_URL = process.env.CLOUDINARY_URL;
const parsedUrl = new URL(CLOUDINARY_URL);
cloudinary.config({
  cloud_name: parsedUrl.hostname,
  api_key:  parsedUrl.username,
  api_secret: parsedUrl.password
});

/* Express App Setup */
const PORT = process.env.PORT;

const __dirname = path.resolve();

/* Middleware */
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(cookieParser());
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URI,
  credentials: true,
}));

app.use("/api/auth/", authRoute);
app.use("/api/message/", messageRoute);
app.use("/api/users/", userRoute);
app.use("/api/profile/",updateRouter)

app.use(express.static(path.join(__dirname,"/frontend/dist")))
// /* Routes */
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});


/* Error handling middleware */
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

server.listen(PORT);
