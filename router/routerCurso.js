// rutas/cursos.js
import express from 'express';
import Curso from '../model/modelCurso.js';
const routerCursos = express.Router();

//Crear Cursos//
routerCursos.post("/", async (req, res) => {
    try {
        const nuevoCurso = new Curso(req.body);
        await nuevoCurso.save();
        res.status(201).json(nuevoCurso);
    } catch (error) {
        res.status(400).json({ mensaje: "Error al crear curso", error });
    }
});

// Ruta para obtener cursos de un profesor específico
routerCursos.get('/profeCursos', async (req, res) => {
  try {
    const profesorId = req.query.profesorId;
    if (!profesorId) {
      return res.status(400).json({ mensaje: 'ID del profesor requerido' });
    }

    // Agrega populate para alumnos
    const cursos = await Curso.find({ profesores: profesorId }).populate('alumnos');

    if (!cursos || cursos.length === 0) {
      return res.status(404).json({ mensaje: 'No se encontraron cursos asignados para este profesor' });
    }

    res.json(cursos);
  } catch (err) {
    console.error('Error al obtener cursos del profesor:', err);
    res.status(500).json({ message: 'Error al obtener los cursos del profesor' });
  }
});

routerCursos.get('/', async (req, res) => {
  try {
    const cursos = await Curso.find()
      .populate({
        path: 'materias',
        select: 'nombre _id'
      })
      .populate({
        path: 'alumnos',
        select: 'nombre apellido _id materiasAlumno',
        populate: {
          path: 'materiasAlumno.materia',
          select: 'nombre'
        }
      })
      .populate({
        path: 'profesores',
        select: 'nombre apellido _id'
      });

    res.json(cursos);
  } catch (err) {
    console.error('Error al obtener los cursos:', err);
    res.status(500).json({ message: 'Error al obtener los cursos' });
  }
});



// Obtener los alumnos de un curso específico
routerCursos.get('/:id/alumnos', async (req, res) => {
  try {
    const curso = await Curso.findById(req.params.id).populate({
      path: 'alumnos',
      select: 'nombre apellido _id materiasAlumno',  // AGREGADO: incluir materiasAlumno
      populate: {
        path: 'materiasAlumno.materia',  // AGREGADO: populate anidado para obtener datos de la materia
        select: 'nombre'
      }
    });
    if (!curso) {
      return res.status(404).json({ mensaje: 'Curso no encontrado' });
    }
    res.json({ data: curso.alumnos });
  } catch (error) {
    console.error('Error al obtener alumnos del curso:', error);
    res.status(500).json({ error: 'Error al obtener los alumnos del curso' });
  }
});


routerCursos.get("/:id", async (req, res) => {
  try {
    const curso = await Curso.findById(req.params.id).populate("alumnos");

    if (!curso) {
      return res.status(404).json({ mensaje: "Curso no encontrado" });
    }

    res.json(curso);
  } catch (error) {
    console.error("Error al buscar curso:", error);
    res.status(500).json({ error: "Error del servidor" });
  }
});

export default routerCursos;