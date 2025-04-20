import express from "express";
import {  postAdminController,  putAdminController,  getAdminController,    deleteAdminController,     getsAdminsController, buscarAdmin } from "../controller/controllerAdmin.js";

const routerAdmin = express.Router();

routerAdmin.get("/", getsAdminsController);
routerAdmin.get("/buscar", buscarAdmin);
routerAdmin.get("/:id", getAdminController);
routerAdmin.post("/", postAdminController);
routerAdmin.put("/:id", putAdminController);
routerAdmin.delete("/:id", deleteAdminController);

export default routerAdmin;
