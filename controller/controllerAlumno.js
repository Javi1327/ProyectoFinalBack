import { getAlumno, getsAlumnos, postAlumno, putAlumno, deleteAlumno } from "../service/serviceAlumno.js";
import Alumno from "../model/modelAlumno.js";
import Curso from "../model/modelCurso.js";
export const buscarAlumno = async (req, res) => {
  const { dni, correoElectronico } = req.query;
  try {
    const query = {};
    if (dni) query.dni = dni;
    if (correoElectronico) query.correoElectronico = correoElectronico;

    const alumno = await Alumno.findOne(query);
    if (!alumno) {
      return res.status(404).json({ mensaje: "Alumno no encontrado" });
    }

    res.json(alumno);
  } catch (error) {
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};

export const getsAlumnosController = async (req, res) => {
    try {
        const alumnos = await getsAlumnos();
        if (alumnos.length === 0) { 
            return res.status(400).json({ status: "error", message: "Alumnos no encontrados", data: {} });
        }
        return res.status(200).json({ status: "success", message: "Alumnos obtenidos", data: alumnos });
    } catch (error) {
        return res.status(500).json({ status: "error", message: "Error en el servidor", data: {} });
    }
};

export const getAlumnoController = async (req, res) => {
    try {
        const id = req.params.id;
        const alumno = await getAlumno(id);
        if (!alumno) {
            return res.status(400).json({ status: "error", message: "Alumno no encontrado", data: {} });
        }
        return res.status(200).json({ status: "success", message: "Alumno obtenido", data: alumno });
    } catch (error) {
        return res.status(500).json({ status: "error", message: "Error en el servidor", data: {} });
    }
};

export const postAlumnoController = async (req, res) => {
    try {
        const { nombre, apellido, dni, grado, direccion, telefono, correoElectronico, fechaNacimiento, asistencia = [], materias = [] } = req.body;

        // Validar campos requeridos
        if (!nombre || !apellido || !dni || !grado || !direccion || !telefono || !fechaNacimiento) {
            return res.status(400).json({ status: "error", message: "Faltan datos obligatorios", data: {} });
        }

        // Buscar el curso por su nombre (grado)
        const curso = await Curso.findOne({ nombre: grado });
        if (!curso) {
            return res.status(400).json({ status: "error", message: "Curso no encontrado", data: {} });
        }

        // Llamar a la función para crear el alumno y asignarle el _id del curso
        const alumnoCreado = await postAlumno(nombre, apellido, dni, curso._id, direccion, telefono, correoElectronico, fechaNacimiento, asistencia, materias);

        return res.status(201).json({ status: "success", message: "Alumno creado", data: alumnoCreado });

    } catch (error) {
        console.error("Error al crear el alumno:", error);
        return res.status(500).json({ status: "error", message: "Error en el servidor", data: {} });
    }
};


export const putAlumnoController = async (req, res) => {
    try {
        const id = req.params.id;
        const { nombre, apellido, dni, grado, direccion, telefono, correoElectronico, fechaNacimiento, asistencia = [], materias = [] } = req.body;

        // Buscar el curso por su nombre (grado)
        const curso = await Curso.findOne({ nombre: grado });
        if (!curso) {
            return res.status(400).json({ status: "error", message: "Curso no encontrado", data: {} });
        }

        let alumno = await putAlumno(id, nombre, apellido, dni, curso._id, direccion, telefono, correoElectronico, fechaNacimiento, asistencia, materias);

        if (alumno) {
            alumno = await getAlumno(id);
            return res.status(200).json({ status: "success", message: "Alumno actualizado", data: alumno });
        } else {
            return res.status(400).json({ status: "error", message: "Alumno no actualizado", data: {} });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "error", message: "Error en el servidor", data: {} });
    }
};


export const deleteAlumnoController = async (req, res) => {
    try {
        const id = req.params.id;
        const alumnoEliminado = await deleteAlumno(id);

        if (alumnoEliminado) {
            return res.status(200).json({ status: "success", message: "Alumno eliminado", data: {} });
        } else {
            return res.status(400).json({ status: "error", message: "Alumno no eliminado", data: {} });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "error", message: "Error en el servidor", data: {} });
    }
};