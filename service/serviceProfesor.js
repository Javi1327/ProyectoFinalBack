import Profesor from "../model/modelProfesor.js";
import crypto from "crypto";

export const getsProfesores = async () => {
    const profesores = await Profesor.find({isHabilitado: true});
    return profesores
}

export const getProfesor = async (id) => {
    const profesor = await Profesor.findOne({id:id});
    return profesor
}

export const postProfesor = async (nombre,apellido,dni,correoElectronico,telefono,materias,cursos) => {
    const profesor = await Profesor.create({id:crypto.randomUUID(),nombre,apellido,dni,correoElectronico,telefono,materias,cursos});
    return profesor
}

export const putProfesor = async (id,nombre,apellido,dni,correoElectronico,telefono,materias,cursos) => {
    const profesor = await Profesor.findOneAndUpdate({id:id},{nombre,apellido,dni,correoElectronico,telefono,materias,cursos})
    return profesor
}

export const deleteProfesor = async (id) => {
    const profesor = await Profesor.findOneAndUpdate({id:id},{isHabilitado:false});
    return profesor
}