import { getPreceptor, getsPreceptores, postPreceptor, putPreceptor, deletePreceptor } from "../service/servicePreceptor.js";
import Preceptor from "../model/modelPreceptor.js";

export const buscarPreceptor = async (req, res) => {
  const { dni, correoElectronico } = req.query;
  try {
    const query = {};
    if (dni) query.dni = dni;
    if (correoElectronico) query.correoElectronico = correoElectronico;

    const preceptor = await Preceptor.findOne(query);
    if (!preceptor) {
      return res.status(404).json({ mensaje: "Preceptor no encontrado" });
    }

    res.json(preceptor);
  } catch (error) {
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};

export const getsPreceptoresController = async (req, res) => {
  try {
    // Cambiado: Filtrar preceptores "eliminados" (isHabilitado: false) directamente en la consulta
    const preceptores = await Preceptor.find({ isHabilitado: { $ne: false } });
    if (preceptores.length === 0) {
      return res.status(400).json({ status: "error", message: "Preceptores no encontrados", data: {} });
    }
    return res.status(200).json({ status: "success", message: "Preceptores obtenidos", data: preceptores });
  } catch (error) {
    return res.status(500).json({ status: "error", message: "Error en el servidor", data: {} });
  }
};

export const getPreceptorController = async (req, res) => {
  try {
    const id = req.params.id;
    const preceptor = await getPreceptor(id);
    if (!preceptor) {
      return res.status(400).json({ status: "error", message: "Preceptor no encontrado", data: {} });
    }
    return res.status(200).json({ status: "success", message: "Preceptor obtenido", data: preceptor });
  } catch (error) {
    return res.status(500).json({ status: "error", message: "Error en el servidor", data: {} });
  }
};

export const postPreceptorController = async (req, res) => {
  try {
    const { nombre, apellido, dni, correoElectronico, telefono } = req.body;

    if (!nombre || !apellido || !dni || !correoElectronico) {
      return res.status(400).json({
        status: "error",
        message: "Faltan datos obligatorios",
        data: {}
      });
    }

    const preceptorCreado = await postPreceptor({
      nombre,
      apellido,
      dni,
      correoElectronico,
      telefono
    });

    res.status(201).json({
      status: "ok",
      message: "Preceptor creado con éxito",
      data: preceptorCreado
    });
  } catch (error) {
    console.error("Error al crear el preceptor:", error);
    res.status(500).json({
      status: "error",
      message: "Error al crear el preceptor",
      data: {}
    });
  }
};

export const putPreceptorController = async (req, res) => {
  try {
    const id = req.params.id;
    const updateData = req.body;

    // Lógica para borrado lógico: Si solo se envía 'isHabilitado: false', actualiza solo ese campo
    if (updateData.isHabilitado === false && Object.keys(updateData).length === 1) {
      const updatedUser = await Preceptor.findByIdAndUpdate(id, { isHabilitado: false }, { new: true });
      if (!updatedUser) {
        return res.status(404).json({ status: "error", message: "Preceptor no encontrado", data: {} });
      }
      return res.status(200).json({ status: "success", message: "Preceptor eliminado lógicamente", data: updatedUser });
    }

    // Lógica existente para otras actualizaciones
    const { nombre, apellido, dni, correoElectronico, telefono } = req.body;

    let preceptor = await putPreceptor(id, nombre, apellido, dni, correoElectronico, telefono);

    if (preceptor) {
      preceptor = await getPreceptor(id);
      return res.status(200).json({ status: "success", message: "Preceptor actualizado", data: preceptor });
    } else {
      return res.status(400).json({ status: "error", message: "Preceptor no actualizado", data: {} });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: "error", message: "Error en el servidor", data: {} });
  }
};

export const deletePreceptorController = async (req, res) => {
  try {
    const id = req.params.id;
    const preceptorEliminado = await deletePreceptor(id);

    if (preceptorEliminado) {
      return res.status(200).json({ status: "success", message: "Preceptor eliminado", data: {} });
    } else {
      return res.status(400).json({ status: "error", message: "Preceptor no eliminado", data: {} });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: "error", message: "Error en el servidor", data: {} });
  }
};