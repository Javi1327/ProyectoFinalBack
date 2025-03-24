import { getMateria, getsMaterias, postMateria, putMateria, deleteMateria } from "../service/serviceMateria.js";

// Obtener todas las materias
// Obtener todas las materias
export const getsMateriasController = async (req, res) => {
    try {
      const materias = await getsMaterias(); // Usamos el servicio para obtener las materias habilitadas
      res.status(200).json(materias);
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
        const { nombreMateria, cursos } = req.body;

        // Llamamos al servicio para crear la materia sin validación de existencia
        const materia = await postMateria(nombreMateria, cursos);

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
        const { nombreMateria, cursos } = req.body; // CAMBIO AQUI: cursos (plural)

        if (!nombreMateria || !cursos || cursos.length === 0) {
            return res.status(400).json({ status: "error", message: "Faltan datos", data: {} });
        }

        let materia = await putMateria(id, nombreMateria, cursos);

        if (materia) {
            materia = await getMateria(id); // Obtener la materia actualizada
            return res.status(200).json({ status: "success", message: "Materia actualizada", data: materia });
        } else {
            return res.status(400).json({ status: "error", message: "Materia no actualizada", data: {} });
        }
    } catch (error) {
        console.error(error);
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
