const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schemaEmpleado = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        unique: false
    },
    correo: {
        type: String,
        required: true,
        unique: true
    },
    contrasenna: {
        type: String,
        required: true,
    },
    direccion: {
        provincia: {
            type: String,
            required: true,
        },
        distrito: {
            type: String,
            required: true,
        },
        canton: {
            type: String,
            required: true,
        },
        ubicacion: {
            type: String
        }
    },
    certificaciones: [
        {
            type: Schema.Types.ObjectId, 
            ref: "Certificacion"
        }
    ]
});

module.exports = mongoose.model("Empleado", schemaEmpleado);