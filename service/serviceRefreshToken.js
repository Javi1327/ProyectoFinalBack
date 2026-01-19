import jwt from "jsonwebtoken";

export const RefreshToken = async (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || "unaclavesecreta");
    const payload = { id: decoded.id, nombre: decoded.nombre, dni: decoded.dni, role: decoded.role };
    const accesstoken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET || "unaclavesecreta", { expiresIn: "1h" });  // Cambiado aquí
    return accesstoken;
  } catch (error) {
    console.log("ERROR EN REFRESH TOKEN", error);
    throw error;
  }
};