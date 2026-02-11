import Admin from "../model/modelAdmin.js";
import crypto from "crypto";

export const getsAdmins = async () => {
    return await Admin.find({ isHabilitado: true });
};

export const getAdmin = async (id) => {
    return await Admin.findById(id);  // Cambiado a findById para buscar por _id
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
    return await Admin.findByIdAndUpdate(  // Cambiado a findByIdAndUpdate para buscar por _id
        id,
        { nombre, apellido, dni, correoElectronico, telefono, isHabilitado: true }, 
        { new: true, runValidators: true }  // Agregado runValidators para validaciones
    );
};

export const deleteAdmin = async (id) => {
    return await Admin.findByIdAndUpdate(  // Cambiado a findByIdAndUpdate para buscar por _id
        id,
        { isHabilitado: false },
        { new: true }  // Devuelve el documento actualizado
    );
};