import Alumno from "../model/modelAlumno.js";
import crypto from "crypto";
import Curso from "../model/modelCurso.js";
import mongoose from "mongoose";

// Obtener todos los alumnos habilitados
export const getsAlumnos = async () => {
    return await Alumno.find({ isHabilitado: true });
};

// Obtener alumno por ID con populate
export const getAlumno = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;

    return await Alumno.findById(id)
        .populate("grado", "nombre")
        .populate("materiasAlumno.materia", "nombre");
};


// Crear un nuevo alumno y asociarlo a un curso
export const postAlumno = async (
    nombre,
    apellido,
    dni,
    grado,
    direccion,
    telefono,
    correoElectronico,
    fechaNacimiento,
    asistencia,
    materiasAlumno
) => {
    try {
        const alumno = await Alumno.create({
            id: crypto.randomUUID(),
            nombre,
            apellido,
            dni,
            grado,
            direccion,
            telefono,
            correoElectronico,
            fechaNacimiento,
            asistencia: Array.isArray(asistencia) ? asistencia : [],
            materiasAlumno: Array.isArray(materiasAlumno) ? materiasAlumno : [],
            isHabilitado: true
        });

        await Curso.findByIdAndUpdate(grado, {
            $push: { alumnos: alumno._id }
        });

        return alumno;
    } catch (error) {
        console.error("Error al crear el alumno o asociarlo al curso", error);
        throw new Error("No se pudo crear el alumno o asociarlo al curso.");
    }
};


export const putAlumno = async (
  id,
  nombre,
  apellido,
  dni,
  grado,
  direccion,
  telefono,
  correoElectronico,
  fechaNacimiento,
  asistencia,
  materias
) => {
  // Calculamos el promedio de cada materia antes de actualizar
  const materiasConPromedio = (Array.isArray(materias) ? materias : []).map(m => ({
    ...m,
    promedio: (m.nota1 + m.nota2) / 2,
  }));

  return await Alumno.findOneAndUpdate(
    { _id: id },  // filtro correcto por _id
    { 
      nombre, 
      apellido, 
      dni, 
      grado, 
      direccion, 
      telefono, 
      correoElectronico, 
      fechaNacimiento, 
      asistencia: Array.isArray(asistencia) ? asistencia : [], 
      materiasAlumno: materiasConPromedio,  // asignamos correctamente
      isHabilitado: true
    },
    { new: true }
  );
};


// Borrado lógico del alumno
export const deleteAlumno = async (_id) => {
    return await Alumno.findOneAndUpdate(
        { _id: _id },
        { isHabilitado: false },
        { new: true }
    );
};
