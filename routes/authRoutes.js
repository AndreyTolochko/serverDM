import { Router } from "express";
import {login,signup, logout, refresh} from "../controllers/authController.js"
import loginLimiter from "../middleware/loginLimiter.js";
import verifyJWT from "../middleware/verifyJWT.js";

const authRouter = Router();

authRouter.route('/')
        .post(loginLimiter, login)

authRouter.route('/signup')
        .post(signup)

authRouter.route('/refresh')
        .get(refresh)


authRouter.route('/logout')
        .post(logout)




export default authRouter;