import Preceptor from "../model/modelPreceptor.js";
import crypto from "crypto";

export const getsPreceptores = async () => {
    return await Preceptor.find({ isHabilitado: true });
};
export const postPreceptor = async (data) => {
    const { nombre, apellido, dni, correoElectronico, telefono } = data;

    const preceptor = await Preceptor.create({
        id: crypto.randomUUID(),
        nombre,
        apellido,
        dni,
        correoElectronico,
        telefono,
        isHabilitado: true
    });
}

export const putPreceptor = async (id, nombre, apellido, dni, correoElectronico, telefono) => {
    return await Preceptor.findByIdAndUpdate(
        id,  // Cambiar a findByIdAndUpdate para usar _id
        { nombre, apellido, dni, correoElectronico, telefono, isHabilitado: true },
        { new: true, runValidators: true }  // Agregar runValidators para validaciones
    );
};

export const getPreceptor = async (id) => {
    return await Preceptor.findById(id);
};

export const deletePreceptor = async (id) => {
    return await Preceptor.findByIdAndUpdate(
        id,
        { isHabilitado: false },
        { new: true }
    );
};
