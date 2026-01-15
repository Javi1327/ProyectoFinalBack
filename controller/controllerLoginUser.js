import { Login } from "../service/serviceLoginUser.js";
import { ChangePassword } from "../service/serviceChangePassword.js";
import { RefreshToken } from "../service/serviceRefreshToken.js";
import jwt from "jsonwebtoken";

// Middleware para verificar token JWT
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Acceso denegado' });
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token inválido' });
    req.user = user;
    next();
  });
};

// Controlador para login único
export const LoginController = async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await Login(username, password);
    if (result === -1) {
      return res.status(400).json({ status: "error", message: "Usuario o contraseña incorrectos", data: {} });
    }
    const { accesstoken, refreshtoken, role, id, nombre, dni } = result;
    return res.status(200).json({ status: "success", message: "Usuario logueado", data: { accesstoken, refreshtoken, role, id, nombre, dni } });
  } catch (error) {
    console.log(error);
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
      if (result === -1) {
        return res.status(400).json({ status: "error", message: "Contraseña actual incorrecta", data: {} });
      }
      return res.status(200).json({ status: "success", message: "Contraseña cambiada", data: {} });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: "error", message: "Error en el servidor", data: {} });
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