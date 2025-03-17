import express from "express";
import { LoginAlumnoController , RefreshTokenController } from "../controller/controllerUsuario.js";

const routerUsuario = express.Router();

routerUsuario.post("/loginAlumno", LoginAlumnoController);
//routerUsuario.post("/register", RegisterUserController);
routerUsuario.post("/token", RefreshTokenController);

export default routerUsuario;