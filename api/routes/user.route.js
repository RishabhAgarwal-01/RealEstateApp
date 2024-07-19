import express from "express";
import { updateUser } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";


const router = express.Router();

//route to update the user detail after authorization
router.get('/update/:id',verifyToken, updateUser);


export default router;