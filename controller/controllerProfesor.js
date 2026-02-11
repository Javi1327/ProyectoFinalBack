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
        // Cambiado: Filtrar profesores "eliminados" (isHabilitado: false) directamente en la consulta
        const profesores = await Profesor.find({ isHabilitado: { $ne: false } });
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
        const id = req.params.id.trim(); // Asegúrate de que no haya espacios en blanco
        const profesor = await Profesor.findById(id)
            .populate('materiaAsignada', 'nombreMateria')  // Cargar solo el campo 'nombre' de la materia
            .populate('cursosAsignados', 'nombre'); // Cargar solo el campo 'nombre' de los cursos

        if (!profesor) {
            return res.status(400).json({ status: "error", message: "Profesor no encontrado", data: {} });
        }
        return res.status(200).json({ status: "success", message: "Profesor obtenido", data: profesor });
    } catch (error) {
        console.error("Error en getProfesorController:", error);
        return res.status(500).json({ status: "error", message: "Error en el servidor", data: {} });
    }
};

export const postProfesorController = async (req, res) => {
    try {
        const {
            nombre,
            apellido,
            dni,
            correoElectronico,
            telefono,
            materiaAsignada,
            cursosAsignados
        } = req.body;

        const profesor = await postProfesor(
            nombre,
            apellido,
            dni,
            correoElectronico,
            telefono,
            materiaAsignada,
            cursosAsignados
        );

        res.status(201).json({
            status: "success",
            message: "Profesor creado",
            data: profesor,
        });
    } catch (error) {
        console.error("Error en postProfesorController:", error);
        res.status(500).json({
            status: "error",
            message: "Error al crear el profesor",
            data: {},
        });
    }
};

export const putProfesorController = async (req, res) => {
    try {
        const id = req.params.id;
        const updateData = req.body;

        // Lógica para borrado lógico: Si solo se envía 'isHabilitado: false', actualiza solo ese campo
        if (updateData.isHabilitado === false && Object.keys(updateData).length === 1) {
            const updatedUser = await Profesor.findByIdAndUpdate(id, { isHabilitado: false }, { new: true });
            if (!updatedUser) {
                return res.status(404).json({ status: "error", message: "Profesor no encontrado", data: {} });
            }
            return res.status(200).json({ status: "success", message: "Profesor eliminado lógicamente", data: updatedUser });
        }

        // Lógica existente para otras actualizaciones
        const {
            nombre,
            apellido,
            dni,
            correoElectronico,
            telefono,
            materiaAsignada,
            cursosAsignados
        } = req.body;

        const profesor = await putProfesor(
            id,
            nombre,
            apellido,
            dni,
            correoElectronico,
            telefono,
            materiaAsignada,
            cursosAsignados
        );

        if (profesor) {
            return res.status(200).json({ status: "success", message: "Profesor actualizado", data: profesor });
        } else {
            return res.status(400).json({ status: "error", message: "Profesor no actualizado", data: {} });
        }
    } catch (error) {
        console.error("Error en putProfesorController:", error);
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