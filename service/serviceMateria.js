import Materia from "../model/modelMateria.js";
import crypto from "crypto";

// Obtener todas las materias habilitadas
export const getsMaterias = async () => {
    const materias = await Materia.find({ isHabilitado: true }); // Solo materias habilitadas
    return materias;
}

// Obtener una materia por su id
export const getMateria = async (id) => {
    const materia = await Materia.findOne({ _id: id }); // Busca por campo 'id'
    return materia;
}

// Crear una materia
export const postMateria = async (nombreMateria, cursos) => {
    try {
        // Crear una nueva materia sin verificar si el nombre ya existe
        const nuevaMateria = new Materia({
            nombreMateria,
            cursos
        });

        // Guardar la materia en la base de datos
        await nuevaMateria.save();

        return nuevaMateria;
    } catch (error) {
        throw new Error('Error al crear la materia: ' + error.message);
    }
};
  




export const putMateria = async (id, nombreMateria, cursos) => {
    try {
        // Buscar la materia por su ID
        const materia = await Materia.findById(id);
        if (!materia) {
            return null; // Si no se encuentra la materia
        }

        // Actualizar los campos
        materia.nombreMateria = nombreMateria;
        materia.cursos = cursos;

        // Guardar la materia actualizada
        await materia.save();

        return materia; // Retornar la materia actualizada
    } catch (error) {
        console.error('Error al actualizar la materia:', error);
        return null;
    }
};


// Eliminar una materia (deshabilitarla)
export const deleteMateria = async (id) => {
    try {
        const materia = await Materia.findOneAndUpdate(
            { _id: id }, // Asegúrate de usar _id y no otro campo
            { isHabilitado: false }, // Deshabilitar la materia
            { new: true } // Devuelve el documento actualizado
        );
        if (!materia) {
            throw new Error('Materia no encontrada o ya eliminada');
        }
        return materia;
    } catch (error) {
        throw new Error('Error al eliminar la materia: ' + error.message);
    }
};


