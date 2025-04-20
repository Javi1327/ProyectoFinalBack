import mongoose from "mongoose";

const ProfesorSchema = new mongoose.Schema({
    id: { type: String, required: true, unique:true },
    isHabilitado: {type: Boolean, default: true},
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    dni: { type: Number, required: true, unique: true },
    correoElectronico: { type: String, required: true },
    telefono: { type: Number },
    materiasAsignadas: [{ type: String }], // Lista de materias que enseña
    cursosAsignados: [{ type: String }], // Lista de cursos que enseña
    fechaContratacion: { type: Date,
        default: Date.now,
    },
});

const Profesor = mongoose.model('Profesor', ProfesorSchema);
export default Profesor;