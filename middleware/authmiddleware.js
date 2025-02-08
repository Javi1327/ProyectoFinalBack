import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers["authorization"];
    console.log(token)
    if (!token) {
        return res.status(401).json({status: "error", menssage: "no autorizado", data:{}});
    }
    const tokenData = jwt.verify(token, process.env.JWT_SECRET || "password");
    if (!tokenData) {
        return res.status(401).json({status: "error", menssage: "no autorizado", data:{}});
    }
    next();
    } catch (error) {
        console.log(error)
    }
    
}