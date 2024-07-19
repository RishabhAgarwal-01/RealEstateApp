import express from "express";
import { google, signin, signup,signOut } from "../controllers/auth.controller.js";

//Router instance
const router = express.Router();

//routing  for signup,signin, signout and google OAuth
router.post("/signup", signup);
router.post("/signin", signin);
router.post("/google", google )
router.get('/signout', signOut)

export default router;