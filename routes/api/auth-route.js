import express from "express";

import authController from "../../controllers/auth-controller.js";
import {isEmptyBody, authenticate} from '../../middlewares/index.js';
import validateBody from '../../decorators/validateBody.js';
import { userRegisterSchema, userLoginSchema } from "../../models/user.js";

const authRouter = express.Router()

authRouter.post("/register", isEmptyBody, validateBody(userRegisterSchema), authController.register);

authRouter.post("/login", isEmptyBody, validateBody(userLoginSchema), authController.login);

authRouter.post( "/logout", authenticate, authController.logout);

authRouter.get("/current", authenticate, authController.current);

export default authRouter;