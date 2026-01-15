import jwt from "jsonwebtoken";

export const RefreshToken = async (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || "unaclavesecreta");
    const payload = { id: decoded.id, nombre: decoded.nombre, dni: decoded.dni, role: decoded.role };
    const accesstoken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
    return accesstoken;
  } catch (error) {
    console.log(error);
    throw error;
  }
};