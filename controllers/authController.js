import * as argon2 from "argon2";
import jwt from "jsonwebtoken";
const {sign, verify} = jwt;
import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import { config } from "dotenv";

config();

//SIGNUP FUNCTION
const signup = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = await User.signup(username, email, password);
    return res.status(200).json({ username, email, user });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

// LOGIN FUNCTION
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields required" });
  }

  const foundUser = await User.findOne({ email }).exec();

  if (!foundUser) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const match = await argon2.verify(foundUser.password, password);

  if (!match) return res.status(401).json({ message: "Unauthorized" });


  const accessToken = sign(
    {
      "UserInfo": {
        "username": foundUser.username,
        "email":foundUser.email,
        "roles": foundUser.roles,
      },
    },    
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "10s" }
    );
  //refresh token variable
  const refreshToken = sign(
      { "username": foundUser.username,
        "email":foundUser.email},
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
  );
  //Create secure cookie with refresh token
  res.cookie('jwt', refreshToken, {
    httpOnly:true, //accessible only by web sever
    /*secure:true, // only https
    sameSite:"none",*/ // cross-site cookie
    maxAge:7*24*60*60*1000 // Set same as life of rt
  })

  // Send access token contain username and role

  res.json({accessToken});
});

//REFRESH FUNCTION
const refresh = (req, res) => {
    const cookies = req.cookies

    if(!cookies?.jwt) return res.status(403).json({message:'No token provided'});
    
    const refreshToken = cookies.jwt;
    verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        asyncHandler(async (err, decoded)=>{
            if (err) return res.status(401).json({message:'Forbidden invalid token provided'})

            const foundUser = await User.findOne({username:decoded.username});

            if(!foundUser) return res.status(401).json({message:'Unauthorized user not found'});

            const accessToken = sign(
                        {
                            "UserInfo":{
                                "username":foundUser.username,
                                "email":foundUser.email,
                                "roles":foundUser.roles
                            }
                        }, 
                        process.env.ACCESS_TOKEN_SECRET,
                        {
                            expiresIn:'10s'
                        }
                    );
            res.json({accessToken});
        })
    )
};

//LOGOUT FUNCTION

const logout = (req, res) => {
  const cookies = req.cookies;
    if(!cookies?.jwt) return res.sendStatus(204);
    res.clearCookie('jwt', {httpOnly:true, /*secure:true, sameSite:'None'*/})
    res.json({message: 'Cookie cleared'})
};

export { login, refresh, logout, signup };
