import mongoose from "mongoose";

const AlumnoSchema = new mongoose.Schema({
    isHabilitado: {type: Boolean, default: true},
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    dni: { type: Number, required: true, unique: true },
    grado: { type: mongoose.Schema.Types.ObjectId, ref: "Curso", required: true },
    direccion: { type: String },
    telefono: { type: String },
    correoElectronico: { type: String },
    fechaNacimiento: { type: Date },
    asistencia: [{
    fecha: { type: String, required: true },  // Cambia a String para coincidir con el frontend
    presente: { type: Boolean, required: true }
   }],
    password: { type: String },
    correoPadre: { type: String },
    correoMadre: { type: String },
    telefonoPadre: { type: String },
    telefonoMadre: { type: String  },
    materiasAlumno: [{
        materia: { type: mongoose.Schema.Types.ObjectId, ref: "Materia" },
        nota1: { type: Number, min: 0, max: 10 },
        nota2: { type: Number, min: 0, max: 10 },
        promedio: { type: Number },
        notaRecuperatorio1: { type: Number, min: 0, max: 10 },  // Recuperatorio para nota1
        notaRecuperatorio2: { type: Number, min: 0, max: 10 },  // Recuperatorio para nota2
        necesitaRecuperatorio: { type: Boolean, default: false },  // Si necesita al menos uno
        estado: { type: String, enum: ['aprobado', 'reprobado', 'pendiente'], default: 'pendiente' }
    }],
    estadoGeneral: { type: String, enum: ['aprobado', 'repite', 'rinde'], default: 'rinde' },
},{  // //Se agregó timestamps: truepara administrar automáticamente createdAtlos updatedAtcampos.
    timestamps: true  
});

// Pre-save hook to calculate the promedio for each materia
AlumnoSchema.pre('save', function(next) {
    let reprobadas = 0;
    this.materiasAlumno.forEach(materia => {
        if (materia.nota1 !== undefined && materia.nota2 !== undefined) {
            // Aplicar recuperatorios individualmente
            let notaFinal1 = materia.nota1;
            let notaFinal2 = materia.nota2;
            let necesitaRec = false;

            if (materia.notaRecuperatorio1 !== undefined && materia.nota1 <= 6) {
                notaFinal1 = materia.notaRecuperatorio1;  // Reemplaza nota1 si <=6
                necesitaRec = true;
            }
            if (materia.notaRecuperatorio2 !== undefined && materia.nota2 <= 6) {
                notaFinal2 = materia.notaRecuperatorio2;  // Reemplaza nota2 si <=6
                necesitaRec = true;
            }

            materia.promedio = (notaFinal1 + notaFinal2) / 2;
            materia.necesitaRecuperatorio = necesitaRec;

            if (materia.promedio >= 7) {
                materia.estado = 'aprobado';
            } else {
                materia.estado = 'reprobado';
                reprobadas++;
            }
        }
    });
    
    // Estado general
    if (reprobadas === 0) this.estadoGeneral = 'aprobado';
    else if (reprobadas > 2) this.estadoGeneral = 'repite';
    else this.estadoGeneral = 'rinde';
    
    next();
});

const Alumno = mongoose.model('Alumno', AlumnoSchema);
export default Alumno;