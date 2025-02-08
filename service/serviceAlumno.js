import Alumno from "../model/modelAlumno.js";
import crypto from "crypto";

export const getsAlumnos = async () => {
    const alumnos = await Alumno.find({isHabilitado: true});
    return alumnos
}

export const getAlumno = async (id) => {
    const alumno = await Alumno.findOne({id:id});
    return alumno
}

export const postAlumno = async (nombre,apellido,dni,grado,direccion,telefono,correoElectronico,fechaNacimiento,asistencia,materias) => {
    const alumno = await Alumno.create({id:crypto.randomUUID(),nombre,apellido,dni,grado,direccion,telefono,correoElectronico,fechaNacimiento,asistencia,materias});
    return alumno
}

export const putAlumno = async (id,nombre,apellido,dni,grado,direccion,telefono,correoElectronico,fechaNacimiento,asistencia,materias) => {
    const alumno = await Alumno.findOneAndUpdate({id:id},{nombre,apellido,dni,grado,direccion,telefono,correoElectronico,fechaNacimiento,asistencia, materias: Array.isArray(materias) ? materias : [] })
    return alumno
}

export const deleteAlumno = async (id) => {
    const alumno = await Alumno.findOneAndUpdate({id:id},{isHabilitado:false});
    return alumno
}