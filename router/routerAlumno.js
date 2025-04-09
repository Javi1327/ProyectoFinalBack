import express from "express";

import { postAlumnoController,putAlumnoController,getAlumnoController,deleteAlumnoController,getsAlumnosController, buscarAlumno } from "../controller/controllerAlumno.js";
const routerAlumno = express.Router();

routerAlumno.get("/", getsAlumnosController)
routerAlumno.get("/buscar", buscarAlumno);
routerAlumno.get("/:id", getAlumnoController)
routerAlumno.post("/", postAlumnoController)
routerAlumno.put("/:id", putAlumnoController)
routerAlumno.delete("/:id", deleteAlumnoController)

export default routerAlumno;