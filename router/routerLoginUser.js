import express from "express";
import { LoginController, ChangePasswordController, RefreshTokenController } from "../controller/controllerLoginUser.js";

const routerLoginUser = express.Router();

routerLoginUser.post("/login", LoginController);
routerLoginUser.post("/change-password", ChangePasswordController);
routerLoginUser.post("/token", RefreshTokenController);

export default routerLoginUser;