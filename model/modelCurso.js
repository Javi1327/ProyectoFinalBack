// modelCurso.js
import mongoose from "mongoose";

const cursoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  alumnos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Alumno" }],
  profesores: [{ type: mongoose.Schema.Types.ObjectId, ref: "Profesor" }],
  materias: [{ type: mongoose.Schema.Types.ObjectId, ref: "Materia" }],
});

const Curso = mongoose.model("Curso", cursoSchema);

export default Curso; // Aquí debes usar "default" para exportar el modelo como default

