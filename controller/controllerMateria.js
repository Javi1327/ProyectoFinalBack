import { getMteria, getsMaterias, postMateria, putMateria, deleteMateria } from "../service/serviceMateria.js";

export const getsMateriasController = async (req, res) => {
    try {
        const materias = await getsMaterias();
        if(materias.length === 0){ 
            return res.status(400).json({status: "error", menssage: "materias no encontrados", data:{}});
        }
        return res.status(200).json({status: "success", menssage: "materias obtenidos", data:materias});
    } catch (error) {
        return res.status(500).json({status: "error", menssage: "error en el servidor", data:{}});
    }
}


export const getMateriaController = async (req, res) => {
    try {
        const id = req.params.id;
        const materia = await getMteria(id);
        if(!materia){
            return res.status(400).json({status: "error", menssage: "materia no encontrado", data:{}});
        }
        return res.status(200).json({status: "success", menssage: "materia obtenido", data:materia});
    } catch (error) {
        return res.status(500).json({status: "error", menssage: "error en el servidor", data:{}});
    }
}


export const postMateriaController = async (req, res) => {
    try {
        const {nombreMateria} = req.body;
        
        if (!nombreMateria) {
            return res.status(400).json({status: "error", menssage: "faltan datos", data:{}});
        }
        
        const materia = await postMateria(nombreMateria);
        
        if(materia){
            return res.status(201).json({status: "success", menssage: "materia creado", data:materia});
        }else{
            return res.status(400).json({status: "error", menssage: "materia no creado", data:{}});
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({status: "error", menssage: "error en el servidor", data:{}});
    }
}


export const putMateriaController = async (req, res) => {
    try {
        const id = req.params.id;
        const {nombreMateria} = req.body;

        if (!nombreMateria) {
            return res.status(400).json({status: "error", menssage: "faltan datos", data:{}});
        }

        let materia = await putMateria(id, nombreMateria);

        if (materia) {
            materia = await getMteria(id);
            return res.status(200).json({status: "success", menssage: "materia actualizado", data:materia});
        } else {
            return res.status(400).json({status: "error", menssage: "materia no actualizado", data:{}});
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({status: "error", menssage: "error en el servidor", data:{}});
    }
}


export const deleteMateriaController = async (req, res) => {
    try {
        const id = req.params.id;
        let materia = await deleteMateria(id);
        if (materia) {
            materia = await getMteria(id);
            return res.status(200).json({status: "success", menssage: "materia eliminado", data:materia});
        }else{
            return res.status(400).json({status: "error", menssage: "materia no eliminado", data:{}});
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({status: "error", menssage: "error en el servidor", data:{}});
    }
}