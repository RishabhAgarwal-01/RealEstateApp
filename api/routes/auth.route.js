import express from "express";
import { google, signin, signup } from "../controllers/auth.controller.js";

//Router instance
const router = express.Router();

//routing  for signup, signout and google OAuth
router.post("/signup", signup);
router.post("/signin", signin);
router.post("/google", google )

export default router;