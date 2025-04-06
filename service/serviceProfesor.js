import Profesor from "../model/modelProfesor.js";
import crypto from "crypto";

export const getsProfesores = async () => {
    return await Profesor.find({ isHabilitado: true });
};

export const getProfesor = async (id) => {
    return await Profesor.findOne({ id });
};

export const postProfesor = async (nombre, apellido, dni, correoElectronico, telefono, materias, cursos) => {
    const profesor = await Profesor.create({
        id: crypto.randomUUID(),
        nombre,
        apellido,
        dni,
        correoElectronico,
        telefono,
        materias: Array.isArray(materias) ? materias : [], // Aseguramos que sea un array
        cursos: Array.isArray(cursos) ? cursos : [], // Aseguramos que sea un array
        isHabilitado: true,  // Siempre inicia habilitado
    });
    return profesor;
};

export const putProfesor = async (id, nombre, apellido, dni, correoElectronico, telefono, materias, cursos) => {
    return await Profesor.findOneAndUpdate(
        { id },
        { 
            nombre, 
            apellido, 
            dni, 
            correoElectronico, 
            telefono, 
            materias: Array.isArray(materias) ? materias : [], 
            cursos: Array.isArray(cursos) ? cursos : [], 
            isHabilitado: true // Mantenemos habilitado
        },
        { new: true } // Devuelve el documento actualizado
    );
};

export const deleteProfesor = async (id) => {
    return await Profesor.findOneAndUpdate(
        { id },
        { isHabilitado: false },
        { new: true } // Devuelve el documento actualizado
    );
};
