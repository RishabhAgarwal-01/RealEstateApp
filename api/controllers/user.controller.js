import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js"
import bcryptjs from "bcryptjs";


//Update User api controller
export const updateUser = async (req, res, next)=>{
    //if id in token not equal to params id return error
  if(req.user.id !== req.params.id) return next(errorHandler(401, "You can only update you own account"))

   //if it matches then
  try {
    //if they are trying to update password hash it
    if(req.body.password){
        req.body.password = bcryptjs.hashSync(req.body.password, 10)

    }

    //get the remaining info from database using the params id
    const updatedUser= await User.findByIdAndUpdate(req.params.id, {
        //set the various field using set method
        $set:{
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            avatar: req.body.avatar,
        }
    },{new: true});

    //remove the password from response to be returned
    const {password, ...rest}= updatedUser._doc;
    //return the response
    res.status(200).json(rest);

  } catch (error) {
    next(error)
  }
}