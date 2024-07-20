import express from "express";
import { updateUser, deleteUser } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";


const router = express.Router();

//route to update the user detail after authorization
router.post('/update/:id',verifyToken, updateUser);
//delete user route
router.delete('/delete/:id',verifyToken, deleteUser);

export default router;