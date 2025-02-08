import  Materia from "../model/modelMateria.js";
import crypto from "crypto";

export const getsMaterias = async () => {
    const materias = await Materia.find({isHabilitado: true});
    return materias
}

export const getMteria = async (id) => {
    const materia = await Materia.findOne({id:id});
    return materia
}

export const postMateria = async (nombreMateria) => {
    const materia = await Materia.create({id:crypto.randomUUID(),nombreMateria});
    return materia
}

export const putMateria = async (id,nombreMateria) => {
    const materia = await Materia.findOneAndUpdate({id:id},{nombreMateria})
    return materia
}

export const deleteMateria = async (id) => {
    const materia = await Materia.findOneAndUpdate({id:id},{isHabilitado:false});
    return materia
}