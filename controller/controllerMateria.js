import { getMateriasByCurso, getMateria, getsMaterias, postMateria, putMateria, deleteMateria } from "../service/serviceMateria.js";
//import Materia from "../models/Materia.js"; // Para populate
import Materia from "../model/modelMateria.js";


export const getMateriasByCursoController = async (req, res) => {
    try {
        const { cursoId } = req.query;  // Obtiene cursoId de la query string
        if (!cursoId) {
            return res.status(400).json({ status: "error", message: "cursoId es requerido", data: {} });
        }
        const materias = await getMateriasByCurso(cursoId);
        return res.status(200).json({ status: "success", message: "Materias obtenidas", data: materias });
    } catch (error) {
        console.error("Error en getMateriasByCursoController:", error);
        return res.status(500).json({ status: "error", message: "Error en el servidor", data: {} });
    }
};

// Obtener todas las materias con los nombres de profesor y cursos
export const getsMateriasController = async (req, res) => {
  try {
    const { cursoId } = req.query;
    let materias = await getsMaterias();  // Asume que getsMaterias() devuelve las materias habilitadas

    if (cursoId) {
      materias = materias.filter(materia => materia.cursos && materia.cursos.includes(cursoId));
    }

    // Populate para cursos y horarios.profesor (ahora funciona con el esquema actualizado)
    const populatedMaterias = await Materia.populate(materias, [
      { path: 'cursos', select: 'nombre' },
      { path: 'horarios.profesor', select: 'nombre apellido' }  // Ahora poblable
    ]);

    // Formatear profesor
    const formattedMaterias = populatedMaterias.map(materia => ({
      ...materia.toObject(),
      horarios: materia.horarios ? materia.horarios.map(h => ({  // Verificación adicional
        ...h,
        profesor: h.profesor ? `${h.profesor.nombre} ${h.profesor.apellido}` : 'Sin asignar'
      })) : []  // Si horarios es null, usa array vacío
    }));

    res.status(200).json(formattedMaterias);
  } catch (error) {
    console.error('Error al obtener las materias:', error);
    res.status(500).json({ message: 'Error al obtener las materias' });
  }
};

// Obtener una materia por ID
export const getMateriaController = async (req, res) => {
    try {
        const id = req.params.id;
        const materia = await getMateria(id);
        if (!materia) {
            return res.status(400).json({ status: "error", message: "Materia no encontrada", data: {} });
        }
        return res.status(200).json({ status: "success", message: "Materia obtenida", data: materia });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "error", message: "Error en el servidor", data: {} });
    }
};

// Crear una nueva materia

export const postMateriaController = async (req, res) => {
    try {
        const { nombreMateria, cursos, horarios } = req.body;  // Agrega horarios

        // Validación básica
        if (!nombreMateria || !cursos || cursos.length === 0) {
            return res.status(400).json({ status: "error", message: "Faltan datos: nombreMateria y cursos son requeridos", data: {} });
        }

        // Llamamos al servicio para crear la materia
        const materia = await postMateria(nombreMateria, cursos, horarios);  // Pasa horarios al servicio

        res.status(201).json({
            status: "success",
            message: "Materia creada",
            data: materia
        });
    } catch (error) {
        res.status(400).json({
            status: "error",
            message: error.message
        });
    }
};


// Actualizar una materia existente
export const putMateriaController = async (req, res) => {
    try {
        const id = req.params.id;
        const { nombreMateria, cursos, horarios } = req.body;  // Destructure as before

        // Validate required fields (unchanged)
        if (!nombreMateria || !cursos || cursos.length === 0) {
            return res.status(400).json({ status: "error", message: "Faltan datos: nombreMateria y cursos son requeridos", data: {} });
        }

        // NEW: Sanitize the horarios array to handle "Sin asignar" for profesor
        // This prevents Mongoose casting errors by converting it to null
        let sanitizedHorarios = horarios;  // Default to original if not an array
        if (horarios && Array.isArray(horarios)) {
            sanitizedHorarios = horarios.map(horario => ({
                ...horario,
                profesor: horario.profesor === "Sin asignar" ? null : horario.profesor
            }));
        }

        // Call the service with sanitized data
        let materia = await putMateria(id, nombreMateria, cursos, sanitizedHorarios);

        if (materia) {
            // Fetch the updated materia (with potential population via getMateria)
            materia = await getMateria(id);
            return res.status(200).json({ status: "success", message: "Materia actualizada", data: materia });
        } else {
            return res.status(400).json({ status: "error", message: "Materia no actualizada", data: {} });
        }
    } catch (error) {
        console.error("Error in putMateriaController:", error);  // Improved logging for debugging
        return res.status(500).json({ status: "error", message: "Error en el servidor", data: {} });
    }
};


export const deleteMateriaController = async (req, res) => {
    try {
        const id = req.params.id;
        const materia = await deleteMateria(id);

        // Si no se encuentra la materia, devuelve un mensaje de error
        if (!materia) {
            return res.status(404).json({
                status: "error",
                message: "Materia no encontrada o ya eliminada",
                data: {}
            });
        }

        return res.status(200).json({
            status: "success",
            message: "Materia eliminada",
            data: materia
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: "error",
            message: "Error al eliminar la materia",
            data: {}
        });
    }
};
