import { getAlumno, getsAlumnos, postAlumno, putAlumno, deleteAlumno } from "../service/serviceAlumno.js";
import Alumno from "../model/modelAlumno.js";

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

        // Llamar a la función para crear el alumno
        const alumnoCreado = await postAlumno(nombre, apellido, dni, grado, direccion, telefono, correoElectronico, fechaNacimiento, asistencia, materias);

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

        let alumno = await putAlumno(id, nombre, apellido, dni, grado, direccion, telefono, correoElectronico, fechaNacimiento, asistencia, materias);

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



export const putAlumnoAsistController = async (req, res) => {
    try {
        const id = req.params.id;   
        const { asistencia } = req.body; // Solo desestructuramos asistencia
        console.log("Datos recibidos:", req.body);

        // Aquí puedes obtener el alumno actual para no perder los demás datos
        //console.log("ID del alumno a buscar:", id);
        let alumno = await getAlumno(id);
        //console.log("Alumno encontrado:", alumno);

        if (!alumno) {
            return res.status(404).json({ status: "error", message: "Alumno no encontrado", data: {} });
        }

        // Actualiza solo el campo de asistencia
        if (asistencia && Array.isArray(asistencia)) {
            asistencia.forEach(({ fecha, presente }) => {
                if (!fecha) {
                    console.error("Fecha no definida:", fecha);
                    return; // Salta esta iteración si la fecha no está definida
                }

                const fechaFormateada = new Date(fecha);
                if (isNaN(fechaFormateada.getTime())) {
                    console.error("Fecha no válida:", fecha);
                    return; // Salta esta iteración si la fecha no es válida
                }

                const fechaISO = fechaFormateada.toISOString().split("T")[0]; // Formato YYYY-MM-DD

                // Verifica si ya existe la fecha en la asistencia
                const index = alumno.asistencia.findIndex(item => item.fecha === fechaISO);
                
                if (presente) {
                    // Si está presente, agrega o actualiza la fecha
                    if (index === -1) {
                        alumno.asistencia.push({ fecha: fechaISO, presente: true });
                    } else {
                        alumno.asistencia[index].presente = true; // Actualiza el estado a presente
                    }
                } else {
                    // Si está ausente, elimina la fecha (si existe)
                    if (index > -1) {
                        alumno.asistencia.splice(index, 1); // Elimina la entrada de asistencia
                    }
                }
            });
        }

        // Guarda el alumno actualizado
        alumno = await putAlumno(id, alumno.nombre, alumno.apellido, alumno.dni, alumno.grado, alumno.direccion, alumno.telefono, alumno.correoElectronico, alumno.fechaNacimiento, alumno.asistencia, alumno.materias);
        //console.log("Alumno actualizado:", alumno);
        if (alumno) {
            return res.status(200).json({ status: "success", message: "Asistencia actualizada", data: alumno });
        } else {
            return res.status(400).json({ status: "error", message: "Asistencia no actualizada", data: {} });
        }
    } catch (error) {
        console.error("Error en el controlador:", error.message); // Imprime el mensaje de error
        return res.status(500).json({ status: "error", message: "Error en el servidor", data: {} });
    }
};