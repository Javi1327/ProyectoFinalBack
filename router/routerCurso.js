// rutas/cursos.js
import express from 'express';
import Curso from '../model/modelCurso.js';
const routerCursos = express.Router();

// Obtener cursos de un profesor
routerCursos.get('/profesor/:profesorId', async (req, res) => {
    try {
        const cursos = await Curso.find({ profesores: req.params.profesorId })
            .populate('alumnos', 'nombre apellido') // solo estos campos
            .populate('profesores', 'nombre apellido');
        res.status(200).json(cursos);
    } catch (error) {
        console.error('Error al obtener los cursos del profesor:', error);
        res.status(500).json({ message: 'Error al obtener los cursos del profesor' });
    }
});

routerCursos.get('/:cursoId/alumnos', async (req, res) => {
    try {
        const curso = await Curso.findById(req.params.cursoId)
            .populate({
                path: 'alumnos',
                select: 'nombre apellido materiasAlumno',
                populate: {
                    path: 'materiasAlumno.materia',
                    select: 'nombre' // si querés mostrar el nombre de la materia
                }
            });

        if (!curso) return res.status(404).json({ message: 'Curso no encontrado' });

        res.status(200).json(curso.alumnos);
    } catch (error) {
        console.error('Error al obtener los alumnos del curso:', error);
        res.status(500).json({ message: 'Error al obtener los alumnos del curso' });
    }
});

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

// Obtener todos los cursos
routerCursos.get('/', async (req, res) => {
    try {
      const cursos = await Curso.find();
      res.json(cursos);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

routerCursos.post('/cursos/multiples', async (req, res) => {
    const { ids } = req.body;
  
    // Validación básica del body
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'Se debe proporcionar un array de IDs de cursos.' });
    }
  
    try {
      const cursos = await Curso.find({ _id: { $in: ids } });
      res.json(cursos);
    } catch (error) {
      console.error('Error al obtener cursos:', error);
      res.status(500).json({ message: 'Hubo un error al obtener los cursos.' });
    }
  });
  
export default routerCursos;

