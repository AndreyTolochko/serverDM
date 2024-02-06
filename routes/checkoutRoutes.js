import { Router } from "express";
import verifyJWT from "../middleware/verifyJWT.js";
import checkoutController from "../controllers/checkoutController.js";


const checkoutRouter = Router();
checkoutRouter.use(verifyJWT);

checkoutRouter.get('/', checkoutController);

export default checkoutRouter;