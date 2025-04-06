import Admin from "../model/modelAdmin.js";
import crypto from "crypto";

export const getsAdmins = async () => {
    return await Admin.find({ isHabilitado: true });
};

export const getAdmin = async (id) => {
    return await Admin.findOne({ id });
};

export const postAdmin = async (nombre, apellido, dni, correoElectronico, telefono) => {
    const admin = await Admin.create({
        id: crypto.randomUUID(),
        nombre,
        apellido,
        dni,
        correoElectronico,
        telefono,
        isHabilitado: true, // Aseguramos que empiece habilitado
    });
    return admin;
};

export const putAdmin = async (id, nombre, apellido, dni, correoElectronico, telefono) => {
    return await Admin.findOneAndUpdate(
        { id },
        { nombre, apellido, dni, correoElectronico, telefono, isHabilitado: true }, 
        { new: true } // Devuelve el documento actualizado
    );
};

export const deleteAdmin = async (id) => {
    return await Admin.findOneAndUpdate(
        { id },
        { isHabilitado: false },
        { new: true } // Devuelve el documento actualizado
    );
};

