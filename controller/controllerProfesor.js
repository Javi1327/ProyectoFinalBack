import { getProfesor,getsProfesores, postProfesor, putProfesor, deleteProfesor } from "../service/serviceProfesor.js";

export const getsProfesoresController = async (req, res) => {
    try {
        const profesores = await getsProfesores();
        if(profesores.length === 0){ 
            return res.status(400).json({status: "error", menssage: "profesores no encontrados", data:{}});
        }
        return res.status(200).json({status: "success", menssage: "profesores obtenidos", data:profesores});
    } catch (error) {
        return res.status(500).json({status: "error", menssage: "error en el servidor", data:{}});
    }
}


export const getProfesorController = async (req, res) => {
    try {
        const id = req.params.id;
        const profesor = await getProfesor(id);
        if(!profesor){
            return res.status(400).json({status: "error", menssage: "profe no encontrado", data:{}});
        }
        return res.status(200).json({status: "success", menssage: "profe obtenido", data:profesor});
    } catch (error) {
        return res.status(500).json({status: "error", menssage: "error en el servidor", data:{}});
    }
}


export const postProfesorController = async (req, res) => {
    try {
        const {nombre, apellido, dni, correoElectronico, telefono, materias , cursos} = req.body;
        
        if (!nombre || !apellido || !dni || !correoElectronico || !telefono || !materias || !cursos) {
            return res.status(400).json({status: "error", menssage: "faltan datos", data:{}});
        }
        
        const profesor = await postProfesor(nombre, apellido, dni, correoElectronico, telefono, materias, cursos);
        
        if(profesor){
            return res.status(201).json({status: "success", menssage: "profe creado", data:profesor});
        }else{
            return res.status(400).json({status: "error", menssage: "profe no creado", data:{}});
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({status: "error", menssage: "error en el servidor", data:{}});
    }
}


export const putProfesorController = async (req, res) => {
    try {
        const id = req.params.id;
        const {nombre, apellido, dni, correoElectronico, telefono, materias, cursos} = req.body;

        if (!nombre || !apellido || !dni || !correoElectronico || !telefono || !materias || !cursos) {
            return res.status(400).json({status: "error", menssage: "faltan datos", data:{}});
        }

        let profesor = await putProfesor(id, nombre, apellido, dni, correoElectronico, telefono, materias, cursos);

        if (profesor) {
            profesor = await getProfesor(id);
            return res.status(200).json({status: "success", menssage: "profe actualizado", data:profesor});
        } else {
            return res.status(400).json({status: "error", menssage: "profe no actualizado", data:{}});
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({status: "error", menssage: "error en el servidor", data:{}});
    }
}


export const deleteProfesorController = async (req, res) => {
    try {
        const id = req.params.id;
        let profesor = await deleteProfesor(id);
        if (profesor) {
            profesor = await getProfesor(id);
            return res.status(200).json({status: "success", menssage: "profe eliminado", data:profesor});
        }else{
            return res.status(400).json({status: "error", menssage: "profe no eliminado", data:{}});
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({status: "error", menssage: "error en el servidor", data:{}});
    }
}