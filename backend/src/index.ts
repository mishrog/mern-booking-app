import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import userRoutes from "./routes/users.routes";
import authRoutes from "./routes/auth.routes";
import myhotelRoutes from "./routes/my-hotels.routes";
import path from "path";

import { v2 as cloudinary } from "cloudinary"; // v2 cloudinary SDK

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

mongoose.connect(process.env.MONGO_DB_URI as string); // cast it as a string so that it doesn't cause problem if the uri is undefined

const app = express();
app.use(cookieParser());
app.use(express.json()); // to convert body of a request to json file automatically for us, so that we don't have to handle it ourselves at each endpoint
app.use(express.urlencoded({ extended: true })); // helps us in parsing urls, to get the created params and things like that
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // our server is only going to accept request from this url
    credentials: true, // req must contain credentials / http cookie
  }) // if any strange url tries to access our backend => if they got a hold of http cookie ( extremely hard), still wouldn't be able
  // to access our server bcz the origin or the url they are trying to access from is different
); // prevents certain requests from certain urls

app.use(express.static(path.join(__dirname, "../../frontend/dist"))); // go to the frontend dist folder which has
// our compiled frontend static assets and serve
// those static assets on the route of our url
// on which our backend runs on

// so now we dont have to run the front end seperately and all we have to do now is start the backend
// and backend served our frontend
// everything gets bundled up together, which is nice for our course

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/my-hotels", myhotelRoutes);

app.get("*", (req: Request, res: Response) => { // catch all route
  res.sendFile(path.join(__dirname, "../../frontend/dist/index.html")); // let react router handle these files
});

app.listen(7000, () => {
  console.log("Server running on localhost 7000");
});
