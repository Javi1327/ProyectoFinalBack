import { getProfesor, getsProfesores, postProfesor, putProfesor, deleteProfesor } from "../service/serviceProfesor.js";
import Profesor from "../model/modelProfesor.js";

export const buscarProfesor = async (req, res) => {
  const { dni, correoElectronico } = req.query;
  try {
    const query = {};
    if (dni) query.dni = dni;
    if (correoElectronico) query.correoElectronico = correoElectronico;

    const profesor = await Profesor.findOne(query);
    if (!profesor) {
      return res.status(404).json({ mensaje: "Profesor no encontrado" });
    }

    res.json(profesor);
  } catch (error) {
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};

export const getsProfesoresController = async (req, res) => {
    try {
        const profesores = await getsProfesores();
        if (profesores.length === 0) { 
            return res.status(400).json({ status: "error", message: "Profesores no encontrados", data: {} });
        }
        return res.status(200).json({ status: "success", message: "Profesores obtenidos", data: profesores });
    } catch (error) {
        return res.status(500).json({ status: "error", message: "Error en el servidor", data: {} });
    }
};

export const getProfesorController = async (req, res) => {
    try {
        const id = req.params.id;
        const profesor = await getProfesor(id);
        if (!profesor) {
            return res.status(400).json({ status: "error", message: "Profesor no encontrado", data: {} });
        }
        return res.status(200).json({ status: "success", message: "Profesor obtenido", data: profesor });
    } catch (error) {
        return res.status(500).json({ status: "error", message: "Error en el servidor", data: {} });
    }
};

export const postProfesorController = async (req, res) => {
    try {
        const { nombre, apellido, dni, correoElectronico } = req.body;

        if (!nombre || !apellido || !dni || !correoElectronico) {
            return res.status(400).json({ status: "error", message: "Faltan datos obligatorios", data: {} });
        }

        const fechaContratacion = new Date(); // 👉 Generamos la fecha actual

        const profesorCreado = await postProfesor(nombre, apellido, dni, correoElectronico, fechaContratacion);

        return res.status(201).json({ status: "success", message: "Profesor creado", data: profesorCreado });

    } catch (error) {
        console.error("Error al crear el profesor:", error);
        return res.status(500).json({ status: "error", message: "Error en el servidor", data: {} });
    }
};



export const putProfesorController = async (req, res) => {
    try {
        const id = req.params.id;
        const { nombre, apellido, dni, correoElectronico, fechaContratacion } = req.body;

        let profesor = await putProfesor(id, nombre, apellido, dni, correoElectronico, fechaContratacion);

        if (profesor) {
            profesor = await getProfesor(id);
            return res.status(200).json({ status: "success", message: "Profesor actualizado", data: profesor });
        } else {
            return res.status(400).json({ status: "error", message: "Profesor no actualizado", data: {} });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "error", message: "Error en el servidor", data: {} });
    }
};

export const deleteProfesorController = async (req, res) => {
    try {
        const id = req.params.id;
        const profesorEliminado = await deleteProfesor(id);

        if (profesorEliminado) {
            return res.status(200).json({ status: "success", message: "Profesor eliminado", data: {} });
        } else {
            return res.status(400).json({ status: "error", message: "Profesor no eliminado", data: {} });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "error", message: "Error en el servidor", data: {} });
    }
};
