import mongoose from "mongoose";

const MateriaSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true},
    isHabilitado: {type: Boolean, default: true},
    nombreMateria: { type: String, required: true},
},{
    timestamps: true
});
 

const Materia = mongoose.model('Materia', MateriaSchema);
export default Materia;
