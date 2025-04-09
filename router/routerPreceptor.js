import express from "express";

import { postPreceptorController,putPreceptorController,getPreceptorController,deletePreceptorController,getsPreceptoresController, buscarPreceptor } from "../controller/controllerPreceptor.js";
const routerPreceptor = express.Router();

routerPreceptor.get("/", getsPreceptoresController)
routerPreceptor.get("/buscar", buscarPreceptor);
routerPreceptor.get("/:id", getPreceptorController)
routerPreceptor.post("/", postPreceptorController)
routerPreceptor.put("/:id", putPreceptorController)
routerPreceptor.delete("/:id", deletePreceptorController)

export default routerPreceptor;    