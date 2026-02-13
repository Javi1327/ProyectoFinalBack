import express from "express";

import { postMateriaController,putMateriaController,getMateriasByCursoController,getMateriaController,deleteMateriaController,getsMateriasController } from "../controller/controllerMateria.js";
const routerMateria = express.Router();

routerMateria.get("/", getsMateriasController)
routerMateria.get('/materias', getMateriasByCursoController);  
routerMateria.get("/:id", getMateriaController)
routerMateria.post("/", postMateriaController)
routerMateria.put("/:id", putMateriaController)
routerMateria.delete("/:id", deleteMateriaController)

export default routerMateria;