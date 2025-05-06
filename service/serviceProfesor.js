import Profesor from "../model/modelProfesor.js";
import crypto from "crypto";
import Curso from "../model/modelCurso.js";

export const getsProfesores = async () => {
    return await Profesor.find({ isHabilitado: true });
};

export const getProfesor = async (id) => {
    return await Profesor.findOne({ id });
};

export const postProfesor = async (nombre, apellido, dni, correoElectronico, telefono, materiaAsignada, cursosAsignados) => {
    try {
        const profesor = await Profesor.create({
            id: crypto.randomUUID(),
            nombre,
            apellido,
            dni,
            correoElectronico,
            telefono,
            materiasAsignadas: materiaAsignada,  // Ahora es un solo ID, no array
            cursosAsignados: Array.isArray(cursosAsignados) ? cursosAsignados : [cursosAsignados],
            isHabilitado: true,
        });

        // Agregamos el profesor a los cursos asignados
        await Curso.updateMany(
            { _id: { $in: cursosAsignados } },
            { $push: { profesores: profesor._id } }
        );

        return profesor;
    } catch (error) {
        console.error("Error al crear el profesor o asignar cursos", error);
        throw new Error("No se pudo crear el profesor o asignar cursos.");
    }
};

export const putProfesor = async (id, nombre, apellido, dni, correoElectronico, telefono, materiaAsignada, cursosAsignados) => {
    try {
        const profesorActualizado = await Profesor.findOneAndUpdate(
            { id },
            {
                nombre,
                apellido,
                dni,
                correoElectronico,
                telefono,
                materiasAsignadas: materiaAsignada,
                cursosAsignados: Array.isArray(cursosAsignados) ? cursosAsignados : [],
                isHabilitado: true,
            },
            { new: true }
        );

        if (!profesorActualizado) {
            throw new Error("Profesor no encontrado para actualizar.");
        }

        // Opcional: Actualizar la referencia en los cursos
        await Curso.updateMany(
            { profesores: profesorActualizado._id },
            { $pull: { profesores: profesorActualizado._id } }
        );
        await Curso.updateMany(
            { _id: { $in: cursosAsignados } },
            { $push: { profesores: profesorActualizado._id } }
        );

        return profesorActualizado;
    } catch (error) {
        console.error("Error al actualizar el profesor o cursos", error);
        throw new Error("No se pudo actualizar el profesor o cursos.");
    }
};

export const deleteProfesor = async (id) => {
    return await Profesor.findOneAndUpdate(
        { id },
        { isHabilitado: false },
        { new: true }
    );
};
