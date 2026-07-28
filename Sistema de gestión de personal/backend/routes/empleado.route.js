const express = require("express");
const router = express.Router();
const Empleado = require("../models/empleado.model");
const Certificacion = require("../models/certificacion.model");

router.post("/", async (req, res) => {
    
    const { nombre, correo, contrasenna, direccion } = req.body;

    // Validar los campos obligatorios 
    if (!nombre || !correo || !contrasenna || !direccion) {
        return res.status(400).json({ mensajeError: "Todos los datos son obligatorios." });
    }

    // Validar los campos aninadados en la dirección
    const {provincia, distrito, canton} = direccion; 
    if (!provincia || !distrito || !canton) {
            return res.status(400).json({ mensajeError: "La dirección debe incluir provincia, cantón y distrito." });
    }

    try {
        const nuevoEmpleado = new Empleado({nombre, correo, contrasenna, direccion});
        await nuevoEmpleado.save();
        res.status(201).json(nuevoEmpleado);
    } catch (error) {
        return res.status(400).json({ mensajeError: "Error al crear el empleado.", error});
    }
});

/* 
http://localhost:3000/empleado
{
  "nombre": "bryan",
  "correo": "bryan@empresax.net",
  "contrasenna": "123",
  "direccion":{
      "provincia": "Cartago",
      "distrito": "Oriental",
      "canton": "Central",
      "ubicacion": "200 metros de la Escuela"
  }
}
*/

router.get("/", async(req, res) =>{
    try{
        const empleados = await Empleado.find().populate("certificaciones"); // Popular certificaciones
        res.json(empleados);
    }catch(error){
        res.status(500).json({mensajeError: "Error al obtener los empleados."});
    }
});

router.put("/agregar-certificacion", async(req, res) =>{
    const {correo, certificacionId} = req.body;

    // Validar los campos obligatorios 
    if (!correo || !certificacionId) {
        return res.status(400).json({ mensajeError: "Correo y Id de la certificación son obligatorios." });
    }

    try{
        // Verificar que existe la certificación
        const certificacion = await Certificacion.findById(certificacionId); 
        if (!certificacion){
            return res.status(400).json({ mensajeError: "Certificación no encontrada.", error});
        }

        // Buscar al empleado y agregar la certificación
        const empleado = await Empleado.findOne({correo});
        if(!empleado){
            return res.status(400).json({ mensajeError: "Empleado no encontrado.", error});
        }
        if(!empleado.certificaciones.includes(certificacionId)){
            empleado.certificaciones.push(certificacionId);
            await empleado.save();
        }
        res.status(200).json({msj: "Certificación agregada al empleado", empleado});

    }catch(error){
        return res.status(400).json({ mensajeError: "Error al agregar la certificación al empleado.", error});
    }
});
/* 
http://localhost:3000/empleados/agregar-certificacion
{
  "correo": "steven@empresax.net",
  "certificacionId": "6a3dedfb4ee85c9ab15b3883"
}
*/

router.delete("/:id", async(req, res) =>{
    const {id} = req.params;

    try{
        const empleado = await Empleado.findByIdAndDelete(id);

        if (!empleado){
            return res.status(400).json({ mensajeError: "Empleado no encontrado."});
        }
        res.status(200).json({msj: "Empleado eliminado"});

    }catch(error){
        return res.status(400).json({ mensajeError: "Error al eliminar empleado.", error});
    }
});

// http://localhost:3000/empleados/6a446e4aae227c178c5bb8d6



module.exports = router;