import express from "express";
import { LoginAlumnoController, LoginProfesorController, LoginPreceptorController, LoginAdminController, RefreshTokenController } from "../controller/controllerLoginUser.js";
 
const routerLoginUser = express.Router();
 
routerLoginUser.post("/loginAlumno", LoginAlumnoController);
routerLoginUser.post("/loginProfesor", LoginProfesorController);
routerLoginUser.post("/loginPreceptor", LoginPreceptorController);
routerLoginUser.post("/loginAdmin", LoginAdminController);
 //routerUsuario.post("/token", RefreshTokenController);
 
export default routerLoginUser;