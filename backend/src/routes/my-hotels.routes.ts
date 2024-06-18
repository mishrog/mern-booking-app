import express, { Request, Response } from "express";
import cloudinary from "cloudinary";
import multer from "multer";
import { HotelType } from "../shared/types";
import verifyToken from "../middleware/auth.middleware";
import { body } from "express-validator";
import Hotel from "../models/hotel.model";

const router = express.Router();

const storage = multer.memoryStorage(); // store any file that we get from push request in memory, we are saving any file ourselves
// we are gonna upload them straight to cloudinary as soon as we get them
// we dont have to store the images ourselves for too long
// save performance on our backend

// we can define storage and file limit and initialize multer

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

// api/my-hotels
// name of the form = imageFiles
// number of images in form = 6
router.post(
  "/",
  verifyToken,
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("city").notEmpty().withMessage("City is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("type").notEmpty().withMessage("Hotel type is required"),
    body("pricePerNight")
      .notEmpty()
      .isNumeric()
      .withMessage("Price per night is required and must be a number"),
    body("facilities")
      .notEmpty()
      .isArray()
      .withMessage("Facilities are required"),
    body("imageUrls").notEmpty().withMessage("Image Urls are required"),
  ],
  upload.array("imageFiles", 6), // multer will attach the file object to the req : done behind the scene as middleware: imageFiles =>cant be more than 6 and should be an array
  async (req: Request, res: Response) => {
    try {
      const imageFiles = req.files as Express.Multer.File[]; // imageFiles array variable
      const newHotel: HotelType = req.body; // newHotel is of HotelType type

      // 1. upload the images to cloudinary
      const uploadPromises = imageFiles.map(async (image) => {
        // encode the image as base64 string so that it can be processed by Cloudinary
        const b64 = Buffer.from(image.buffer).toString("base64"); // creating a buffer from image object
        let dataURI = "data:" + image.mimetype + ";base64," + b64;
        const res = await cloudinary.v2.uploader.upload(dataURI);
        return res.url; // return the url where the image is hosted
      });

      // 2. if upload was successful, add the URLs to the hotel object (new hotel)

      const imageUrls = await Promise.all(uploadPromises); // wait for all our imgs to be uploaded b4 we get a string array that gets assigned to this variable
      newHotel.imageUrls = imageUrls;
      newHotel.lastUpdated = new Date();
      newHotel.userId = req.userId; // taken userId from req for security reasons => middleware parses cookie to userID (data of auth_token)

      // 3. save the new hotel in our DB

      const hotel = new Hotel(newHotel);
      await hotel.save();

      // 4. return a 201 status
      res.status(201).send(hotel);
    } catch (error) {
      console.log("Error creating hotel: ", error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
); // anytime we need to create something we use post

router.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const hotels = await Hotel.find({ userId: req.userId });
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ message: "Error fetching hotels" });
  }
});

export default router;
