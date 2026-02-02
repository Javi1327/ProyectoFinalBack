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
  horarios: [{
    curso: { type: mongoose.Schema.Types.ObjectId, ref: 'Curso' },
    diaSemana: { type: String, enum: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'] },
    horaInicio: { type: String },
    horaFin: { type: String },
    // Nota: No tienes 'profesor' en horarios. Si es así, el populate fallará. Agrega si es necesario:
    profesor: { type: mongoose.Schema.Types.ObjectId, ref: 'Profesor' },
  }],
}, { timestamps: true });

const Materia = mongoose.model('Materia', materiaSchema);

export default Materia;