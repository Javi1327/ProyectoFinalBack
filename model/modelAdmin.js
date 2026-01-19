import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  isHabilitado: { type: Boolean, default: true },
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  dni: { type: Number, required: true, unique: true },
  correoElectronico: { type: String, required: true },
  telefono: { type: Number },
  password: { type: String },
});

const Admin = mongoose.model('Admin', AdminSchema);
export default Admin;

