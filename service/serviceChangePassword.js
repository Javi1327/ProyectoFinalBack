import bcrypt from "bcrypt";
import Alumno from "../model/modelAlumno.js";
import Profesor from "../model/modelProfesor.js";
import Preceptor from "../model/modelPreceptor.js";
import Admin from "../model/modelAdmin.js";

export const ChangePassword = async (userId, currentPassword, newPassword) => {
  try {
    let user = await Alumno.findById(userId) || await Profesor.findById(userId) || await Preceptor.findById(userId) || await Admin.findById(userId);
    if (!user) return -1;

    // Si no tiene password (primera vez), no compara; si tiene, compara
    if (user.password && !(await bcrypt.compare(currentPassword, user.password))) return -1;

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    return { success: true };
  } catch (error) {
    console.log(error);
    return -1;
  }
};