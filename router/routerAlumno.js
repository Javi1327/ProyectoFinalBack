import express from "express";

import { postAlumnoController,putAlumnoController,putAlumnoAsistController,getAlumnoController,deleteAlumnoController,getsAlumnosController,buscarAlumno } from "../controller/controllerAlumno.js";
const routerAlumno = express.Router();

routerAlumno.get("/", getsAlumnosController)
routerAlumno.get("/buscar", buscarAlumno);
routerAlumno.get("/:id", getAlumnoController)
routerAlumno.post("/", postAlumnoController)
routerAlumno.put("/:id", (req, res) => {
    if (req.body.asistencia) {
      return putAlumnoAsistController(req, res);
    } else {
      return putAlumnoController(req, res);
    }
  });
routerAlumno.delete("/:id", deleteAlumnoController)

export default routerAlumno;