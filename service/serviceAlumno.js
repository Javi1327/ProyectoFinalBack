import Alumno from "../model/modelAlumno.js";
import crypto from "crypto";
import Curso from "../model/modelCurso.js";

export const getsAlumnos = async () => {
    return await Alumno.find({ isHabilitado: true });
};

export const getAlumno = async (id) => {
    return await Alumno.findOne({ id });
};


export const postAlumno = async (
    nombre,
    apellido,
    dni,
    grado, // <- esto es el _id del curso
    direccion,
    telefono,
    correoElectronico,
    fechaNacimiento,
    asistencia,
    materias
) => {
    try {
        // Crear el alumno
        const alumno = await Alumno.create({
            id: crypto.randomUUID(),
            nombre,
            apellido,
            dni,
            grado, // <- guardamos el _id del curso
            direccion,
            telefono,
            correoElectronico,
            fechaNacimiento,
            asistencia: Array.isArray(asistencia) ? asistencia : [],
            materiasAlumno: Array.isArray(materias) ? materias : [],
            isHabilitado: true
        });

        // Ahora, agregamos el alumno al curso correspondiente
        await Curso.findByIdAndUpdate(grado, {
            $push: { alumnos: alumno._id }  // Agregamos el _id del alumno al curso
        });

        return alumno;
    } catch (error) {
        console.error("Error al crear el alumno o asociarlo al curso", error);
        throw new Error("No se pudo crear el alumno o asociarlo al curso.");
    }
};


export const putAlumno = async (id, nombre, apellido, dni, grado, direccion, telefono, correoElectronico, fechaNacimiento, asistencia, materias) => {
    return await Alumno.findOneAndUpdate(
        { id },
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
            materias: Array.isArray(materias) ? materias : [], 
            isHabilitado: true // Mantenemos habilitado
        },
        { new: true } // Devuelve el documento actualizado
    );
};

export const deleteAlumno = async (id) => {
    return await Alumno.findOneAndUpdate(
        { id },
        { isHabilitado: false },
        { new: true } // Devuelve el documento actualizado
    );
};

