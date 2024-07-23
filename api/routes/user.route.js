import express from "express";
import { updateUser, deleteUser, getUserListings, getUser} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";


const router = express.Router();

//route to update the user detail after authorization
router.post('/update/:id',verifyToken, updateUser);
//delete user route
router.delete('/delete/:id',verifyToken, deleteUser);
// show all listing
router.get('/listings/:id',verifyToken, getUserListings);
//
router.get('/:id', verifyToken, getUser);
export default router;