import {LoginAlumno, RefreshToken } from "../service/serviceUsuario.js";



export const LoginAlumnoController = async (req, res) => {
    try {
        const { nombre, dni } = req.body;
        const {accesstoken, refreshtoken, id} = await LoginAlumno(nombre, dni);
        if (!accesstoken || !refreshtoken) {
            return res.status(400).json({status: "error", menssage: "error en el servidor", data:{}});
        }else{
            return res.status(200).json({status: "success", menssage: "usuario logueado", data:{accesstoken, refreshtoken, id}});
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({status: "error", menssage: "error en el servidor", data:{}});
    }
}


export const RefreshTokenController = async (req, res) => {
    try {
        const refreshtoken = req.headers["x-refresh-token"]
        if (!refreshtoken) {
            return res.status(400).json({status: "error", menssage: "error en el servidor", data:{}});
        }
        const accesstoken = await RefreshToken(refreshtoken);
        return res.status(200).json({status: "success", menssage: "token actualizado", data:{accesstoken}});
    } catch (error) {
        console.log(error)
        return res.status(500).json({status: "error", menssage: "error en el servidor", data:{}});
    }
}