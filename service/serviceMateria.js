import Materia from "../model/modelMateria.js";
import Curso from "../model/modelCurso.js"; // Asegúrate de importar el modelo de los cursos
import crypto from "crypto";

// Obtener todas las materias habilitadas
export const getsMaterias = async () => {
    const materias = await Materia.find({ isHabilitado: true }); // Solo materias habilitadas
    return materias;
}

// Obtener una materia por su id
export const getMateria = async (id) => {
    const materia = await Materia.findOne({ _id: id }).populate('cursos'); // Busca por campo 'id'
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

        // Actualizar los cursos con la nueva materia
        await Curso.updateMany(
            { _id: { $in: cursos } }, // Actualiza los cursos cuyos _id están en el array 'cursos'
            { $addToSet: { materias: nuevaMateria._id } } // Agrega el _id de la nueva materia al array 'materias' en los cursos
        );

        return nuevaMateria;
    } catch (error) {
        throw new Error('Error al crear la materia: ' + error.message);
    }
};

export const putMateria = async (id, nombreMateria, cursos) => {
    try {
        // Verificación de parámetros
        if (!nombreMateria || !Array.isArray(cursos)) {
            throw new Error("Datos inválidos para la actualización");
        }

        // Buscar la materia por su ID
        const materia = await Materia.findById(id);
        if (!materia) {
            return null; // Si no se encuentra la materia
        }

        // Actualizar los campos de la materia
        materia.nombreMateria = nombreMateria;
        materia.cursos = cursos;

        // Guardar la materia actualizada
        await materia.save();

        // Actualizar los cursos que contienen esta materia
        for (const cursoId of cursos) {
            await Curso.findByIdAndUpdate(cursoId, {
                $addToSet: { materias: materia._id } // Añadir la materia al array de materias del curso
            });
        }

        return materia; // Retornar la materia actualizada
    } catch (error) {
        console.error('Error al actualizar la materia:', error);
        return null;
    }
};

// Eliminar una materia (deshabilitarla)
export const deleteMateria = async (id) => {
    try {
        // Buscar y deshabilitar la materia
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
