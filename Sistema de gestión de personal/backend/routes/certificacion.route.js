const express = require("express");
const router = express.Router();
const Certificacion = require("../models/certificacion.model");

// Guardar una certificación 
router.post("/", async (req, res) => {
    try {
        const { nombre, institucion, vigencia } = req.body;

        // Validar los campos obligatorios 
        if (!nombre || !institucion) {
            return res.status(400).json({ mensajeError: "El nombre de la certificación y la institución son obligatorios." });
        }

        // Validar la vigencia 
        if (vigencia) {
            const { expira, fechaExpiracion } = vigencia;

            // Si expira, la fecha es obligatoria
            if (expira && !fechaExpiracion) {
                return res.status(400).json({ mensajeError: "Debe indicar la fecha de expiración." });
            }
        }

        const nuevaCertificacion = new Certificacion(req.body);
        await nuevaCertificacion.save();
        res.status(201).json(nuevaCertificacion);
    } catch (error) {
        return res.status(400).json({ mensajeError: "Error al crear la certificación.", error});
    }
});

/* 
http://localhost:3000/certificaciones

{
  "nombre": "React",
  "institucion": "CENFOTEC"
}

{
  "nombre": "Buenas prácticas en ciberseguridad",
  "institucion": "Empresa X",
  "vigencia": {
    "expira": true,
    "fechaExpiracion": "2027-06-25"
  }
}
  
*/

router.get("/", async(req, res) =>{
    try{
        const certificaciones = await Certificacion.find();
        res.json(certificaciones);
    }catch(error){
        res.status(500).json({mensajeError: "Error al obtener las certificaciones."});
    }
});

// http://localhost:3000/certificaciones

// Primeras N certificaciones registradas 
router.get("/primeras/:cantidad", async(req, res) =>{
    try{
        const cantidad = parseInt(req.params.cantidad);

        // Validar cantidad > 0
        if(isNaN(cantidad) || cantidad <= 0){
            res.status(400).json({mensajeError: "La cantidad debe ser mayor a 0."});
        }

        const certificaciones = await Certificacion.find().sort({_id: 1}).limit(cantidad);
        res.json(certificaciones);
    }catch(error){
        res.status(500).json({mensajeError: "Error al obtener las certificaciones."});
    }
});
// http://localhost:3000/certificaciones/primeras/3

router.get("/top-instituciones/:top", async (req, res) => {
    try {
        const top = parseInt(req.params.top); // Convertir el String a un entero

        // Validar si no es un número o no es mayor a 0
        if (isNaN(top) || top <= 0) { 
            return res.status(400).json({msj: "El parámetro top debe ser un número mayor a 0."  });
        }

        /* aggregate(): Realizar operaciones avanzadas sobre los documentos: agrupar, contar, ordenar, calcular promedios, sumar, entre otras 
        $group: Agrupa todos los documentos que tengan el mismo valor en el campo institucion
        $sum: 1: Por cada documento encontrado aumente el contador 
        cantidadCertificaciones: -1: Orden descendente
        */
        const instituciones = await Certificacion.aggregate([
            {
                $group: {
                    _id: "$institucion",
                    cantidadCertificaciones: {
                        $sum: 1
                    }
                }
            },
            {
                $sort: {
                    cantidadCertificaciones: -1
                }
            },
            {
                $limit: top
            }
        ]);

        res.json(instituciones);

    } catch (error) {
        res.status(500).json({msj: "Error al obtener el top de instituciones", error});
    }
});

// http://localhost:3000/certificaciones/top-instituciones/1

module.exports = router;