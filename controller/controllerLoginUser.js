import { Login } from "../service/serviceLoginUser.js";
import { ChangePassword } from "../service/serviceChangePassword.js";
import { RefreshToken } from "../service/serviceRefreshToken.js";
import jwt from "jsonwebtoken";

// Middleware para verificar token JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Acceso denegado' });

  // USAR SOLO LA VARIABLE DEL ENV
  const secret = process.env.JWT_ACCESS_SECRET;

  //console.log('--- DEBUG BACKEND ---');
  //console.log('Secreto recuperado del env:', secret); 

  jwt.verify(token, secret, (err, user) => {
    if (err) {
      console.log('Error específico:', err.message);
      return res.status(403).json({ error: 'Token inválido' });
    }
    req.user = user;
    next();
  });
};

// Controlador para login único
export const LoginController = async (req, res) => {
  console.log('Petición de login recibida:', req.body);  // Agrega esto
  try {
    const { username, password } = req.body;
    const result = await Login(username, password);
    if (result === -1) {
      return res.status(400).json({ status: "error", message: "Usuario o contraseña incorrectos", data: {} });
    }
    const { accesstoken, refreshtoken, role, id, nombre, dni } = result;
   // console.log('Login exitoso, generando tokens...');  // Agrega esto
   // console.log('Access token generado:', accesstoken.substring(0, 50) + '...');  // Muestra parte
   // console.log('Refresh token generado:', refreshtoken.substring(0, 50) + '...');  // Muestra parte
    return res.status(200).json({ status: "success", message: "Usuario logueado", data: { accesstoken, refreshtoken, role, id, nombre, dni } });
  } catch (error) {
    console.log('Error en login:', error);
    return res.status(500).json({ status: "error", message: "Error en el servidor", data: {} });
  }
};

// Controlador para cambio de contraseña (con middleware de autenticación)
export const ChangePasswordController = [
  authenticateToken,
  async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.id;
      
      const result = await ChangePassword(userId, currentPassword, newPassword);
      
      // Si la función devuelve -1, es porque la contraseña actual no coincidió
      if (result === -1) {
        return res.status(400).json({ 
          status: "error", 
          message: "La contraseña actual es incorrecta." 
        });
      }

      // Si todo salió bien
      return res.status(200).json({ 
        status: "success", 
        message: "Contraseña actualizada correctamente en la base de datos." 
      });

    } catch (error) {
      console.log("Error en el controlador:", error);
      return res.status(500).json({ 
        status: "error", 
        message: "Error interno del servidor" 
      });
    }
  }
];

// Controlador para refresh token
export const RefreshTokenController = async (req, res) => {
  try {
    const refreshtoken = req.headers["x-refresh-token"];
    if (!refreshtoken) {
      return res.status(400).json({ status: "error", message: "Token faltante", data: {} });
    }
    const accesstoken = await RefreshToken(refreshtoken);
    return res.status(200).json({ status: "success", message: "Token actualizado", data: { accesstoken } });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "error", message: "Error en el servidor", data: {} });
  }
};