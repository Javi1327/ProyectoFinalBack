import Preceptor from "../model/modelPreceptor.js";
import crypto from "crypto";

export const getsPreceptores = async () => {
    return await Preceptor.find({ isHabilitado: true });
};

export const getPreceptor = async (id) => {
    return await Preceptor.findOne({ id });
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
    return await Preceptor.findOneAndUpdate(
        { id },
        { nombre, apellido, dni, correoElectronico, telefono, isHabilitado: true }, // Nos aseguramos que siga habilitado
        { new: true } // Para devolver el documento actualizado
    );
};

export const deletePreceptor = async (id) => {
    return await Preceptor.findOneAndUpdate(
        { id },
        { isHabilitado: false },
        { new: true } // Para devolver el documento actualizado
    );
};
