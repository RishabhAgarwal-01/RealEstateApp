import { errorHandler } from "./error.js";
import jwt from "jsonwebtoken";


//verify token utility/middleware -->authorization
export const verifyToken = (req, res, next)=>{
    //get the token from request object
    const token = req.cookies.access_token;

    //if no token then user not verified and hence unauthorized for the update operation
    if(!token) return next(errorHandler(401, "Unauthorized"));

    //verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, user)=>{
        if(err) return next(errorHandler(403, "Forbidden"));

        req.user= user; //it is just the user id dsaved in the token

        next(); //call the next function
    })
}