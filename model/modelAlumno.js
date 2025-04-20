import mongoose from "mongoose";

const AlumnoSchema = new mongoose.Schema({
    isHabilitado: {type: Boolean, default: true},
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    dni: { type: Number, required: true, unique: true },
    grado: { type: String, required: true },
    direccion: { type: String },
    telefono: { type: String },
    correoElectronico: { type: String },
    fechaNacimiento: { type: Date },
    asistencia: [{ fecha: { type: Date }, presente: { type: Boolean } }],
    materias: [{
        materia: { type: mongoose.Schema.Types.ObjectId, ref: "Materia" },
        //materia: { type: String },
        nota1: { type: Number, min: 0, max: 10 },
        nota2: { type: Number, min: 0, max: 10 },
        promedio: { type: Number }
    }]
},{  // //Se agregó timestamps: truepara administrar automáticamente createdAtlos updatedAtcampos.
    timestamps: true  
});

// Pre-save hook to calculate the promedio for each materia
AlumnoSchema.pre('save', function(next) {
    this.materias.forEach(materia => {
        if (materia.nota1 !== undefined && materia.nota2 !== undefined) {
            materia.promedio = (materia.nota1 + materia.nota2) / 2;
        }
    });
    next();
});

const Alumno = mongoose.model('Alumno', AlumnoSchema);
export default Alumno;