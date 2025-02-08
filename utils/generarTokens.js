import jwt from "jsonwebtoken";

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "unaclavesecreta";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "unaclavesecreta";
const JWT_ACCESS_EXPIRES = process.env.JWT_ACCESS_EXPIRES;
const JWT_REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES;

export const generateAccessToken = payload => {
    const expiraEn = JWT_ACCESS_EXPIRES || 60*15; // 15 minutos
    const token = jwt.sign(payload, JWT_ACCESS_SECRET, { expiresIn: expiraEn });
    return token
}

export const generateRefreshToken = payload => {
    const expiraEn = JWT_REFRESH_EXPIRES || 60*60*24*30; // 30 dias
    const token = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: expiraEn });
    return token
}