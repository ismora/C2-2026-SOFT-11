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





module.exports = router;