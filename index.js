import express from "express";
import cors from "cors"; // npm i cors
import env from "dotenv"; // npm i dotenv
import mongoose from "mongoose"; // npm i mongoose
import { authMiddleware } from "./middleware/authmiddleware.js";
import routerPreceptor from "./router/routerPreceptor.js";
import routerProfesor from "./router/routerProfesor.js";
import routerAlumno from "./router/routerAlumno.js";
import routerMateria from "./router/routerMateria.js";
import routerAdmin from "./router/routerAdmin.js";
import routerCurso from "./router/routerCurso.js"
import { crearCursosSiNoExisten } from "./utils/creacionCursos.js";

env.config();

const PORT = process.env.PORT || 3000;

const app = express();

// Middleware para manejar JSON y CORS
app.use(express.json());
app.use(
  cors({
    origin: "*", // Permite cualquier origen
    allowedHeaders: ["Content-Type", "Authorization", "x-refresh-token"], // Asegúrate de que las cabeceras estén correctas
  })
);

// Rutas
app.use("/preceptores", routerPreceptor);
app.use("/profesores", routerProfesor);
app.use("/alumnos", routerAlumno);
app.use("/materias", routerMateria);
app.use("/admins", routerAdmin)
app.use("/cursos",routerCurso)

// Ruta protegida con authMiddleware
app.use("/protected", authMiddleware, (req, res) => {
  res.json({ message: "Acceso permitido", user: req.user });
});

// Manejo de error 404
app.use((req, res) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

// Conexión con MongoDB
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Conectado a MongoDB");
    crearCursosSiNoExisten();
  })
  .catch((error) => {
    console.error("Error de conexión a MongoDB:", error);
  });

// Inicia el servidor en el puerto especificado
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
