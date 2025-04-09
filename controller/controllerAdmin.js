import {  getAdmin,  getsAdmins,  postAdmin, putAdmin,  deleteAdmin } from "../service/serviceAdmin.js";
import Admin from "../model/modelAdmin.js";
export const buscarAdmin = async (req, res) => {
    const { dni, correoElectronico } = req.query;
    try {
      const query = {};
      if (dni) query.dni = dni;
      if (correoElectronico) query.correoElectronico = correoElectronico;
  
      const admin = await Admin.findOne(query);
      if (!admin) {
        return res.status(404).json({ mensaje: "Admin no encontrado" });
      }
  
      res.json(admin);
    } catch (error) {
      res.status(500).json({ mensaje: "Error en el servidor" });
    }
  };

export const getsAdminsController = async (req, res) => {
    try {
        const admins = await getsAdmins();
        if (admins.length === 0) {
            return res.status(400).json({ status: "error", message: "Admins no encontrados", data: {} });
        }
        return res.status(200).json({ status: "success", message: "Admins obtenidos", data: admins });
    } catch (error) {
        return res.status(500).json({ status: "error", message: "Error en el servidor", data: {} });
    }
};

export const getAdminController = async (req, res) => {
    try {
        const id = req.params.id;
        const admin = await getAdmin(id);
        if (!admin) {
            return res.status(400).json({ status: "error", message: "Admin no encontrado", data: {} });
        }
        return res.status(200).json({ status: "success", message: "Admin obtenido", data: admin });
    } catch (error) {
        return res.status(500).json({ status: "error", message: "Error en el servidor", data: {} });
    }
};

export const postAdminController = async (req, res) => {
    try {
        const { nombre, apellido, dni, correoElectronico, telefono } = req.body;

        // Validar campos requeridos
        if (!nombre || !apellido || !dni || !correoElectronico) {
            return res.status(400).json({ status: "error", message: "Faltan datos obligatorios", data: {} });
        }

        // Llamar a la función para crear el admin
        const adminCreado = await postAdmin(nombre, apellido, dni, correoElectronico, telefono);

        return res.status(201).json({ status: "success", message: "Admin creado", data: adminCreado });
    } catch (error) {
        console.error("Error al crear el admin:", error);
        return res.status(500).json({ status: "error", message: "Error en el servidor", data: {} });
    }
};

export const putAdminController = async (req, res) => {
    try {
        const id = req.params.id;
        const { nombre, apellido, dni, correoElectronico, telefono } = req.body;

        let admin = await putAdmin(id, nombre, apellido, dni, correoElectronico, telefono);

        if (admin) {
            admin = await getAdmin(id);
            return res.status(200).json({ status: "success", message: "Admin actualizado", data: admin });
        } else {
            return res.status(400).json({ status: "error", message: "Admin no actualizado", data: {} });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "error", message: "Error en el servidor", data: {} });
    }
};

export const deleteAdminController = async (req, res) => {
    try {
        const id = req.params.id;
        let admin = await deleteAdmin(id);

        if (admin) {
            admin = await getAdmin(id);
            return res.status(200).json({ status: "success", message: "Admin eliminado", data: admin });
        } else {
            return res.status(400).json({ status: "error", message: "Admin no eliminado", data: {} });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "error", message: "Error en el servidor", data: {} });
    }
};
