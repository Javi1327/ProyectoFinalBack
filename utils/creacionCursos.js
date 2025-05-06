import Curso from '../model/modelCurso.js';

const cursosPredefinidos = [
  { nombre: '1A', materias: [], profesores: [] },
  { nombre: '1B', materias: [], profesores: [] },
  { nombre: '2A', materias: [], profesores: [] },
  { nombre: '2B', materias: [], profesores: [] },
  { nombre: '3A', materias: [], profesores: [] },
  { nombre: '3B', materias: [], profesores: [] },
  { nombre: '4A', materias: [], profesores: [] },
  { nombre: '4B', materias: [], profesores: [] },
  { nombre: '5A', materias: [], profesores: [] },
  { nombre: '5B', materias: [], profesores: [] },
  { nombre: '6A', materias: [], profesores: [] },
  { nombre: '6B', materias: [], profesores: [] },
];

// Función para crear los cursos automáticamente si no existen
export const crearCursosSiNoExisten = async () => {
  try {
    // Verificar si los cursos ya existen en la base de datos
    const cursosExistentes = await Curso.find();

    if (cursosExistentes.length === 0) {
      // Si no existen cursos, crear los cursos predefinidos
      await Curso.insertMany(cursosPredefinidos);
      console.log('Cursos predefinidos creados con éxito.');
    } else {
      console.log('Los cursos ya están registrados.');
    }
  } catch (error) {
    console.error('Error al crear cursos predefinidos:', error);
  }
};
