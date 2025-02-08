import Preceptor from "../model/modelPreceptor.js"
import crypto from "crypto";

export const getsPreceptores = async () => {
    const preceptores = await Preceptor.find({isHabilitado: true});
    return preceptores
}

export const getPreceptor = async (id) => {
    const preceptores = await Preceptor.findOne({id:id});
    return preceptores
}

export const postPreceptor = async (nombre,apellido,dni,correoElectronico,telefono) => {
    const preceptores = await Preceptor.create({id:crypto.randomUUID(),nombre,apellido,dni,correoElectronico,telefono});
    return preceptores
}

export const putPreceptor = async (id,nombre,apellido,dni,correoElectronico,telefono) => {
    const preceptores = await Preceptor.findOneAndUpdate({id:id},{nombre,apellido,dni,correoElectronico,telefono})
    return preceptores
}

export const deletePreceptor = async (id) => {
    const preceptores = await Preceptor.findOneAndUpdate({id:id},{isHabilitado:false});
    return preceptores
}