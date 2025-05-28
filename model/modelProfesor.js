import mongoose from "mongoose";

const ProfesorSchema = new mongoose.Schema({
    isHabilitado: { type: Boolean, default: true },
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    dni: { type: Number, required: true, unique: true },
    correoElectronico: { type: String, required: true },
    telefono: { type: Number },
    materiaAsignada: { type: mongoose.Schema.Types.ObjectId, ref: 'Materia' },
    cursosAsignados: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Curso' }],
    fechaContratacion: { type: Date, default: Date.now }
});


const Profesor = mongoose.model('Profesor', ProfesorSchema);
export default Profesor;
