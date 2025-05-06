import mongoose from 'mongoose';

const materiaSchema = new mongoose.Schema({
  nombreMateria: {
    type: String,
    required: true,
  },
  cursos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Curso',  // Relacionamos directamente con la colección de cursos
    required: true,
  }],
  isHabilitado: {
    type: Boolean,
    default: true,
  },
});

const Materia = mongoose.model('Materia', materiaSchema);

export default Materia;
