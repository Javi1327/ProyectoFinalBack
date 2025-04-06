import Alumno from "../model/modelAlumno.js";
import crypto from "crypto";

export const getsAlumnos = async () => {
    return await Alumno.find({ isHabilitado: true });
};

export const getAlumno = async (id) => {
    return await Alumno.findOne({ id });
};

export const postAlumno = async (nombre, apellido, dni, grado, direccion, telefono, correoElectronico, fechaNacimiento, asistencia, materias) => {
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
        materias: Array.isArray(materias) ? materias : [],
        isHabilitado: true,  // Aseguramos que el alumno empiece habilitado
    });
    return alumno;
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
