import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Alumno from "../model/modelAlumno.js";
import Profesor from "../model/modelProfesor.js";
import Preceptor from "../model/modelPreceptor.js";
import Admin from "../model/modelAdmin.js";

import { generateRefreshToken, generateAccessToken } from "../utils/generarTokens.js";
 
  
export const LoginAlumno = async (nombre, dni) => {
    try{
        const user = await Alumno.findOne({nombre,dni});  // buscar por el nombre y el dni del alumno en la bd
    if(!user) {
        return -1
    }
   /*  const passmatch = await bcrypt.compare(password, user.password);
     if(!passmatch) {
         return -1
     }*/
 
    const accesstoken = generateAccessToken({nombre,dni: user.dni, id: user._id});
    const refreshtoken = generateRefreshToken({nombre,dni: user.dni, id: user._id});
    return {accesstoken, refreshtoken, id: user.id}
    } catch (error) {
        console.log(error)
    }
     
}


export const LoginProfesor = async (nombre, dni) =>{
    try{
        const user = await Profesor.findOne({nombre,dni});  // buscar por el nombre y el dni del profesor en la bd
    if(!user) {
        return -1
    }

    const accesstoken = generateAccessToken({nombre,dni: user.dni, id: user._id});
    const refreshtoken = generateRefreshToken({nombre,dni: user.dni, id: user._id});
    return {accesstoken, refreshtoken, id: user.id}
    } catch (error) {
        console.log(error)
    }
}


export const LoginPreceptor = async (nombre, dni) =>{
    try{
        const user = await Preceptor.findOne({nombre,dni});  // buscar por el nombre y el dni del preceptor en la bd
    if(!user) {
        return -1
    }

    const accesstoken = generateAccessToken({nombre,dni: user.dni, id: user._id});
    const refreshtoken = generateRefreshToken({nombre,dni: user.dni, id: user._id});
    return {accesstoken, refreshtoken, id: user.id}
    } catch (error) {
        console.log(error)
    }
}


export const LoginAdmin = async (nombre, dni) =>{
    try{
        const user = await Admin.findOne({nombre,dni});  // buscar por el nombre y el dni del admin en la bd
    if(!user) {
        return -1
    }

    const accesstoken = generateAccessToken({nombre,dni: user.dni, id: user._id});
    const refreshtoken = generateRefreshToken({nombre,dni: user.dni, id: user._id});
    return {accesstoken, refreshtoken, id: user.id}
    } catch (error) {
        console.log(error)
    }
}
 
 
export const RefreshToken = async (refreshToken) => {
    const user = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET  || "unaclavesecreta");
 
    const userDB = await Usuario.findOne({username: user.username});
 
    if(!userDB) {
        return -1
    }
 
    const accesstoken = generateAccessToken({username:user.username,password: user.password, id: user._id});
    return accesstoken
}