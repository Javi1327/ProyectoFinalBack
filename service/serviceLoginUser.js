import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Alumno from "../model/modelAlumno.js";
import Profesor from "../model/modelProfesor.js";
import Preceptor from "../model/modelPreceptor.js";
import Admin from "../model/modelAdmin.js";
import { generateRefreshToken, generateAccessToken } from "../utils/generarTokens.js";

export const Login = async (username, password) => {
  try {
    let user = null;
    let role = null;

    // Primero, busca usuario por nombre en todas las colecciones
    user = await Alumno.findOne({ nombre: username }) ||
           await Profesor.findOne({ nombre: username }) ||
           await Preceptor.findOne({ nombre: username }) ||
           await Admin.findOne({ nombre: username });

    if (!user) {
      // Si no existe, verifica si es un login temporal (username === password y es rol válido)
      if (username === password && ['alumno', 'profesor', 'preceptor', 'admin'].includes(username)) {
        const Model = username === 'alumno' ? Alumno : username === 'profesor' ? Profesor : username === 'preceptor' ? Preceptor : Admin;
        user = await Model.findOne({ nombre: username });
        if (!user) {
          const hashedPassword = await bcrypt.hash(password, 10);
          user = new Model({ nombre: username, dni: 'temporal', password: hashedPassword });
          await user.save();
        }
        role = username;  // Rol basado en username
      } else {
        return -1;  // Usuario no encontrado y no es temporal
      }
    } else {
      // Usuario existe: Determina rol real de la colección
      if (user instanceof Alumno) role = 'alumno';
      else if (user instanceof Profesor) role = 'profesor';
      else if (user instanceof Preceptor) role = 'preceptor';
      else if (user instanceof Admin) role = 'admin';

      // Verifica contraseña
      let validPassword = false;
      if (user.password) {
        // Si tiene password hasheado (cambió contraseña), compara con bcrypt
        validPassword = await bcrypt.compare(password, user.password);
      } else {
        // Si no tiene password (datos antiguos), compara con dni o rol
        validPassword = (password == user.dni) || (password === role);
      }

      if (!validPassword) return -1;
    }

//const accesstoken = generateAccessToken({ nombre: user.nombre, dni: user.dni, id: user._id, role });
  //  const refreshtoken = generateRefreshToken({ nombre: user.nombre, dni: user.dni, id: user._id, role });
    const accesstoken = generateAccessToken({ nombre: user.nombre, dni: user.dni, id: user._id, role });
   // console.log('Generando access token con secreto:', process.env.JWT_ACCESS_SECRET);  // Agrega esto
  //  console.log('Access token generado:', accesstoken.substring(0, 50) + '...');  // Muestra parte del token
    const refreshtoken = generateRefreshToken({ nombre: user.nombre, dni: user.dni, id: user._id, role });
  //  console.log('Refresh token generado con secreto:', process.env.JWT_REFRESH_SECRET);  // Agrega esto
    return { accesstoken, refreshtoken, role, id: user._id, nombre: user.nombre, dni: user.dni };
  } catch (error) {
    console.log(error);
    return -1;
  }
};