import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import { config } from "dotenv";



const checkoutController = (req,res) =>{
    
    const user = req.user
    const email = req.email

    if(!user || !email) return res.status(401).json({message: 'Error there is no username or email'})

    res.status(200).json({username:user, email:email})
}

export default checkoutController;