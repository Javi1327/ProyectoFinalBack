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
        const { nombre, apellido, dni, grado, direccion, telefono, correoElectronico, fechaNacimiento, asistencia, correoPadre, correoMadre, telefonoPadre, telefonoMadre } = req.body;
        // Validar campos requeridos
        if (!nombre || !apellido || !dni || !grado || !direccion || !telefono || !fechaNacimiento || !correoPadre || !correoMadre || !telefonoPadre || !telefonoMadre) {
            return res.status(400).json({ status: "error", message: "Faltan datos obligatorios", data: {} });
        }
        // Buscar el curso por su nombre (grado)
        const curso = await Curso.findOne({ nombre: grado }).populate('materias', '_id');
        if (!curso) {
            return res.status(400).json({ status: "error", message: "Curso no encontrado", data: {} });
        }
        // Crear materiasAlumno basado en las materias del curso
        const materiasAlumno = curso.materias.map(materiaId => ({ materia: materiaId._id }));
        // Llamar a la función para crear el alumno y asignarle el _id del curso
        const alumnoCreado = await postAlumno(nombre, apellido, dni, curso._id, direccion, telefono, correoElectronico, fechaNacimiento, asistencia, materiasAlumno);
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
      materiasAlumno = []
    } = req.body;

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

    // Calcular promedio para cada materia (corregido el error de sintaxis)
    const materiasConPromedio = materiasAlumno.map(materia => {
      if (materia.nota1 !== undefined && materia.nota2 !== undefined) {  // Corregido: !== undefined &&
        return {
          ...materia,
          promedio: (materia.nota1 + materia.nota2) / 2
        };
      }
      return materia;
    });

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
    const { asistencia } = req.body;
    console.log("Datos recibidos:", req.body);

    let alumno = await Alumno.findById(id);
    if (!alumno) {
      return res.status(404).json({ status: "error", message: "Alumno no encontrado", data: {} });
    }

    if (asistencia && Array.isArray(asistencia)) {
      // Filtrar para mantener solo la ÚLTIMA entrada por fecha (sobrescribe duplicados)
      const uniqueAsistencia = [];
      const seenFechas = new Set();
      asistencia.reverse().forEach(reg => {
        if (!seenFechas.has(reg.fecha)) {
          uniqueAsistencia.unshift(reg);
          seenFechas.add(reg.fecha);
        }
      });

      console.log("Asistencia filtrada (única por fecha):", uniqueAsistencia);
      alumno.asistencia = uniqueAsistencia;
    }

    // Guarda el alumno actualizado
    const alumnoActualizado = await alumno.save();
    if (alumnoActualizado) {
      console.log("Guardado exitosamente:", alumnoActualizado.asistencia);
      return res.status(200).json({ status: "success", message: "Asistencia actualizada", data: alumnoActualizado });
    } else {
      return res.status(400).json({ status: "error", message: "Asistencia no actualizada", data: {} });
    }
  } catch (error) {
    console.error("Error en el controlador:", error.message);
    return res.status(500).json({ status: "error", message: "Error en el servidor", data: {} });
  }
};




// Esta función se encarga de actualizar las notas de un alumno en una materia específica

export const actualizarNotasMateria = async (req, res) => {
  try {
    const { idAlumno, idMateria } = req.params;
    const { nota1, nota2 } = req.body;
    console.log("Params recibidos:", req.params);
    console.log("Body recibido:", req.body);
    // Validaciones básicas
    if (nota1 !== undefined && (isNaN(nota1) || nota1 < 1 || nota1 > 10)) {
      return res.status(400).json({ message: "nota1 debe ser un número entre 1 y 10" });
    }
    if (nota2 !== undefined && (isNaN(nota2) || nota2 < 1 || nota2 > 10)) {
      return res.status(400).json({ message: "nota2 debe ser un número entre 1 y 10" });
    }
    const alumno = await Alumno.findById(idAlumno);
    console.log("Alumno encontrado:", !!alumno, "ID buscado:", idAlumno);
    if (!alumno) return res.status(404).json({ message: "Alumno no encontrado" });
    const materiaObj = alumno.materiasAlumno.find(m => m.materia.toString() === idMateria);
    console.log("Materia encontrada en alumno:", !!materiaObj, "ID buscado:", idMateria);
    console.log("materiasAlumno del alumno:", alumno.materiasAlumno);
    if (!materiaObj) return res.status(404).json({ message: "Materia no encontrada en alumno" });
    // Verificar si ya tiene notas (previene modificaciones desde "subir notas")
    //if (materiaObj.nota1 !== undefined || materiaObj.nota2 !== undefined) {
    //  return res.status(400).json({ message: "Este alumno ya tiene notas cargadas para esta materia. Usa el componente de modificación." });
    //}
    if (nota1 !== undefined) materiaObj.nota1 = nota1;
    if (nota2 !== undefined) materiaObj.nota2 = nota2;
    // Calcula promedio solo si ambas notas existen
    if (materiaObj.nota1 !== undefined && materiaObj.nota2 !== undefined) {
      materiaObj.promedio = (materiaObj.nota1 + materiaObj.nota2) / 2;
    }
    await alumno.save();
    res.json({ message: "Notas actualizadas", alumno });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error actualizando notas" });
  }
};
