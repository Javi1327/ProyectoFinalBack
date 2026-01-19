import bcrypt from "bcrypt";
import Alumno from "../model/modelAlumno.js";
import Profesor from "../model/modelProfesor.js";
import Preceptor from "../model/modelPreceptor.js";
import Admin from "../model/modelAdmin.js";

/*
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
*/ /*

export const ChangePassword = async (userId, currentPassword, newPassword) => {
  try {
    // 1. Log para ver qué ID está llegando realmente
    console.log("Buscando usuario con ID:", userId);

    // Intentamos buscar por ID de Mongoose (_id)
    let user = await Alumno.findById(userId) || 
               await Profesor.findById(userId) || 
               await Preceptor.findById(userId) || 
               await Admin.findById(userId);

    if (!user) {
        console.log("Usuario no encontrado en ninguna colección");
        return -1;
    }

    console.log("Usuario encontrado:", user.nombre);

    // 2. Verificación de contraseña actual
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
        console.log("La contraseña actual no coincide");
        return -1;
    }

    // 3. Encriptar y GUARDAR
    user.password = await bcrypt.hash(newPassword, 10);
    
    // El .save() es lo que realmente impacta la base de datos
    const savedUser = await user.save();
    
    console.log("Contraseña actualizada correctamente en DB");
    return { success: true };

  } catch (error) {
    console.log("Error en la lógica de ChangePassword:", error);
    return -1;
  }
};  */

export const ChangePassword = async (userId, currentPassword, newPassword) => {
  try {
    let user = await Alumno.findById(userId) || await Profesor.findById(userId) || await Preceptor.findById(userId) || await Admin.findById(userId);
    
    if (!user) return -1;

    // Lógica inteligente: 
    // Si el usuario YA TIENE password, usamos ese.
    // Si NO TIENE password (es nuevo), usamos su DNI como contraseña actual.
    const passwordDeReferencia = user.password || user.dni.toString();

    console.log("DEBUG: Referencia para validar:", passwordDeReferencia);

    // Comparamos lo que envió el usuario con nuestra referencia
    // (Aceptamos texto plano para el DNI o Hash para la password nueva)
    const isMatch = (currentPassword.toString() === passwordDeReferencia.toString()) || 
                    (user.password ? await bcrypt.compare(currentPassword, user.password) : false);

    if (!isMatch) {
      console.log("DEBUG: La contraseña actual no coincide con DNI ni con Password");
      return -1;
    }

    // AHORA SÍ: Guardamos la nueva contraseña en el nuevo campo
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    
    console.log("DEBUG: ¡Contraseña creada y guardada con éxito!");
    return { success: true };
  } catch (error) {
    console.log("ERROR:", error);
    return -1;
  }
};