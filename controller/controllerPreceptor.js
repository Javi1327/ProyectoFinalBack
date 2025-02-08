import { getPreceptor, getsPreceptores, postPreceptor, putPreceptor, deletePreceptor } from "../service/servicePreceptor.js";

export const getsPreceptoresController = async (req, res) => {
    try {
        const preceptores = await getsPreceptores();
        if(preceptores.length === 0){ 
            return res.status(400).json({status: "error", menssage: "preceptores no encontrados", data:{}});
        }
        return res.status(200).json({status: "success", menssage: "preceptores obtenidos", data:preceptores});
    } catch (error) {
        return res.status(500).json({status: "error", menssage: "error en el servidor", data:{}});
    }
}


export const getPreceptorController = async (req, res) => {
    try {
        const id = req.params.id;
        const preceptor = await getPreceptor(id);
        if(!preceptor){
            return res.status(400).json({status: "error", menssage: "preceptor no encontrado", data:{}});
        }
        return res.status(200).json({status: "success", menssage: "preceptor obtenido", data:preceptor});
    } catch (error) {
        return res.status(500).json({status: "error", menssage: "error en el servidor", data:{}});
    }
}


export const postPreceptorController = async (req, res) => {
    try {
        const {nombre, apellido, dni, correoElectronico, telefono} = req.body;
        
        if (!nombre || !apellido || !dni || !correoElectronico || !telefono) {
            return res.status(400).json({status: "error", menssage: "faltan datos", data:{}});
        }
        
        const preceptor = await postPreceptor(nombre, apellido, dni, correoElectronico, telefono);
        
        if(preceptor){
            return res.status(201).json({status: "success", menssage: "preceptor creado", data:preceptor});
        }else{
            return res.status(400).json({status: "error", menssage: "preceptor no creado", data:{}});
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({status: "error", menssage: "error en el servidor", data:{}});
    }
}


export const putPreceptorController = async (req, res) => {
    try {
        const id = req.params.id;
        const {nombre, apellido, dni, correoElectronico, telefono} = req.body;

        if (!nombre || !apellido || !dni || !correoElectronico || !telefono) {
            return res.status(400).json({status: "error", menssage: "faltan datos", data:{}});
        }

        let preceptor = await putPreceptor(id, nombre, apellido, dni, correoElectronico, telefono);

        if (preceptor) {
            preceptor = await getPreceptor(id);
            return res.status(200).json({status: "success", menssage: "preceptor actualizado", data:preceptor});
        } else {
            return res.status(400).json({status: "error", menssage: "preceptor no actualizado", data:{}});
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({status: "error", menssage: "error en el servidor", data:{}});
    }
}


export const deletePreceptorController = async (req, res) => {
    try {
        const id = req.params.id;
        let preceptor = await deletePreceptor(id);
        if (preceptor) {
            preceptor = await getPreceptor(id);
            return res.status(200).json({status: "success", menssage: "preceptor eliminado", data:preceptor});
        }else{
            return res.status(400).json({status: "error", menssage: "preceptor no eliminado", data:{}});
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({status: "error", menssage: "error en el servidor", data:{}});
    }
}