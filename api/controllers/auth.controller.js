import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";


//signup api
export const signup = async (req, res, next) => {
  //extract the info
  const { username, email, password } = req.body; 

  //check for all fields
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  //hash the password using bcrypt js
  const hashedPassword = bcryptjs.hashSync(password, 10); 
  //create a new user
  const newUser = new User({ username, email, password: hashedPassword }); 
  try {
    await newUser.save(); //save it to database
    res.status(201).json('User created successfully!'); //send the response
  } catch (error) {
    next(error); //handle error using the middleware in index.js
  }
};

//sign-up api
export const signin = async (req, res, next)=>{
  //extract info
   const {email, password} = req.body;
   try {
    //find the user using the email
      const validUser = await User.findOne({email});
      if(!validUser) return next(errorHandler(404, "User not found"));

      //check for valid hashed password with the stored hashed password
      const validPassword = bcryptjs.compareSync(password, validUser.password);
      if(!validPassword) return next(errorHandler(401, "Wrong Credentials"));
      
      //generate a token
      const token= jwt.sign({id: validUser._id}, process.env.JWT_SECRET);

      //remmove the password from the data to be stored in cookies
      const {password:pass, ...rest}= validUser._doc;

      //create a cookie and return it to browser
      res.cookie('access_token', token, {httponly:true}).status(200).json(rest);

   } catch (error) {
     next(error); //handle error
   }
}


//google OAuth 
export const google = async(req, res, next)=>{
  try {
    //find the user with email
    const user = await User.findOne({ email: req.body.email });
    //if already exist i.e. user trying to sign in with google OAuth
    if (user) {
      //just create a token and return the response
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = user._doc;
      res
        .cookie('access_token', token, { httpOnly: true })
        .status(200)
        .json(rest);
    } 
    //if user not present then sign up is happening
    else{
      //generate a random password as OAuth object don't have the password
      const generatedPassword =
      Math.random().toString(36).slice(-8) +
      Math.random().toString(36).slice(-8);
      //hash it
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

      //create new user
      const newUser = new User({
        username: req.body.name.split(' ').join('').toLowerCase() + Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
      });

      //save new user
      await newUser.save();

      //token generation
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);

      //remove password
      const { password: pass, ...rest } = newUser._doc;

      //send the cookie in response
      res
        .cookie('access_token', token, { httpOnly: true })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
}


//signout api 
export const signOut = async (req, res, next) => {
  try {
    //just clear the cookie
    res.clearCookie('access_token');
    res.status(200).json('User has been logged out!');
  } catch (error) {
    next(error);
  }
};