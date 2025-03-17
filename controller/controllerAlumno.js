import { getAlumno, getsAlumnos, postAlumno, putAlumno, deleteAlumno } from "../service/serviceAlumno.js";

export const getsAlumnosController = async (req, res) => {
    try {
        const alumnos = await getsAlumnos();
        if(alumnos.length === 0){ 
            return res.status(400).json({status: "error", menssage: "alumnos no encontrados", data:{}});
        }
        return res.status(200).json({status: "success", menssage: "alumnos obtenidos", data:alumnos});
    } catch (error) {
        return res.status(500).json({status: "error", menssage: "error en el servidor", data:{}});
    }
}


export const getAlumnoController = async (req, res) => {
    try {
        const id = req.params.id;
        const alumno = await getAlumno(id);
        if(!alumno){
            return res.status(400).json({status: "error", menssage: "alumno no encontrado", data:{}});
        }
        return res.status(200).json({status: "success", menssage: "alumno obtenido", data:alumno});
    } catch (error) {
        return res.status(500).json({status: "error", menssage: "error en el servidor", data:{}});
    }
}
 

export const postAlumnoController = async (req, res) => {
    try {
        const { nombre, apellido, dni, grado, direccion, telefono, correoElectronico, fechaNacimiento, asistencia, materias } = req.body;

        // Validar campos requeridos
        if (!nombre || !apellido || !dni || !grado || !direccion || !telefono || !correoElectronico || !fechaNacimiento) {
            return res.status(400).json({ status: "error", menssage: "faltan datos", data: {} });
        }

        // Llamar a la función para crear el alumno
        const alumnoCreado = await postAlumno(nombre, apellido, dni, grado, direccion, telefono, correoElectronico, fechaNacimiento, asistencia, materias);

        return res.status(201).json({ status: "success", menssage: "Alumno creado", data: alumnoCreado });


    } catch (error) {
        console.error("Error al crear los alumnos:", error);
        return res.status(500).json({ status: "error", menssage: "error en el servidor", data: {} });
    }
};


export const putAlumnoController = async (req, res) => {
    try {
        const id = req.params.id;
        const {nombre, apellido, dni, grado, direccion, telefono, correoElectronico, fechaNacimiento, asistencia, materias} = req.body;

      /*  if (!nombre || !apellido || !dni || !grado || !direccion || !telefono || !correoElectronico || !fechaNacimiento  || !asistencia  || !materias) {
            return res.status(400).json({status: "error", menssage: "faltan datos", data:{}});
        }*/

        let alumno = await putAlumno(id, nombre, apellido, dni, grado, direccion, telefono, correoElectronico, fechaNacimiento, asistencia, materias);

        if (alumno) {
            alumno = await getAlumno(id);
            return res.status(200).json({status: "success", menssage: "alumno actualizado", data:alumno});
        } else {
            return res.status(400).json({status: "error", menssage: "alumno no actualizado", data:{}});
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({status: "error", menssage: "error en el servidor", data:{}});
    }
}


export const deleteAlumnoController = async (req, res) => {
    try {
        const id = req.params.id;
        let alumno = await deleteAlumno(id);
        if (alumno) {
            alumno = await getAlumno(id);
            return res.status(200).json({status: "success", menssage: "alumno eliminado", data:alumno});
        }else{
            return res.status(400).json({status: "error", menssage: "alumno no eliminado", data:{}});
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({status: "error", menssage: "error en el servidor", data:{}});
    }
}