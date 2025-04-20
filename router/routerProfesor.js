import express from "express";
import { postProfesorController,putProfesorController,getProfesorController,deleteProfesorController,getsProfesoresController, buscarProfesor} from "../controller/controllerProfesor.js";
const routerProfesor = express.Router();

routerProfesor.get("/", getsProfesoresController)
routerProfesor.get("/buscar", buscarProfesor);
routerProfesor.get("/:id", getProfesorController)
routerProfesor.post("/", postProfesorController)
routerProfesor.put("/:id", putProfesorController)
routerProfesor.delete("/:id", deleteProfesorController)

export default routerProfesor; 