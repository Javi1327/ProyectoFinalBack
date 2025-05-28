import { getAlumno, getsAlumnos, postAlumno, putAlumno, deleteAlumno } from "../service/serviceAlumno.js";
import Alumno from "../model/modelAlumno.js";
import Curso from "../model/modelCurso.js";
import mongoose from "mongoose";
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
        console.error("Error en getAlumnoController:", error);
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
        console.log("Datos recibidos en req.body:", req.body);
        const id = req.params.id;
        const {
            nombre,
            apellido,
            dni,
            grado,
            direccion,
            telefono,
            correoElectronico,
            fechaNacimiento,
            asistencia = [],
            materiasAlumno = [] // cambiar acá
        } = req.body;

        // Buscar el curso por id
        const curso = mongoose.Types.ObjectId.isValid(grado)
            ? await Curso.findById(grado)
            : null;

        if (!curso) {
            return res.status(400).json({
                status: "error",
                message: "Curso no encontrado",
                data: {}
            });
        }

        // Calcular promedio para cada materia
        const materiasConPromedio = materiasAlumno.map(materia => {
            if (materia.nota1 !== undefined && materia.nota2 !== undefined) {
                return {
                    ...materia,
                    promedio: (materia.nota1 + materia.nota2) / 2
                };
            }
            return materia;
        });

        // Actualizar alumno con datos y materias con promedio
        const alumnoActualizado = await Alumno.findOneAndUpdate(
            { _id: id },
            {
                nombre,
                apellido,
                dni,
                grado: curso._id,
                direccion,
                telefono,
                correoElectronico,
                fechaNacimiento,
                asistencia: Array.isArray(asistencia) ? asistencia : [],
                materiasAlumno: Array.isArray(materiasConPromedio) ? materiasConPromedio : [],
                isHabilitado: true
            },
            { new: true }
        ).populate({
            path: "grado",
            select: "nombre"
        }).populate({
            path: "materiasAlumno.materia",
            select: "nombre"
        });

        if (alumnoActualizado) {
            return res.status(200).json({
                status: "success",
                message: "Alumno actualizado correctamente",
                data: alumnoActualizado
            });
        } else {
            return res.status(400).json({
                status: "error",
                message: "No se pudo actualizar el alumno",
                data: {}
            });
        }

    } catch (error) {
        console.error("Error en putAlumnoController:", error);
        return res.status(500).json({
            status: "error",
            message: "Error en el servidor",
            data: {}
        });
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


// Esta función se encarga de actualizar las notas de un alumno en una materia específica
export const actualizarNotasMateria = async (req, res) => {
  try {
    const { idAlumno, idMateria } = req.params;
    const { nota1, nota2 } = req.body;

    const alumno = await Alumno.findById(idAlumno);
    if (!alumno) return res.status(404).json({ message: "Alumno no encontrado" });

    const materiaObj = alumno.materiasAlumno.find(m => m.materia.toString() === idMateria);
    if (!materiaObj) return res.status(404).json({ message: "Materia no encontrada en alumno" });

    if (nota1 !== undefined) materiaObj.nota1 = nota1;
    if (nota2 !== undefined) materiaObj.nota2 = nota2;

    // Calculamos promedio automático
    materiaObj.promedio = ((materiaObj.nota1 || 0) + (materiaObj.nota2 || 0)) / 2;

    await alumno.save();

    res.json({ message: "Notas actualizadas", alumno });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error actualizando notas" });
  }
};
