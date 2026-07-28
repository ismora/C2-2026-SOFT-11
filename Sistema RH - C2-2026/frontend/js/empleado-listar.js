const tablaEmpleados = document.getElementById("tblEmpleados").querySelector("tbody"); 

async function cargarTabla() {
    fetch("http://localhost:3000/empleados", {
        method: "GET", 
        headers: {
            "Content-Type": "Application/json"
        }
    }).then(response => response.json())
    .then(listaEmpleados => {
        tablaEmpleados.innerHTML = ""; //impia la tabla 
        listaEmpleados.forEach(usuario => {
            const fila = document.createElement("tr"); 

            let informacionCertificaciones = "";
            usuario.certificaciones.forEach(certificacion => {
                informacionCertificaciones += certificacion.nombre + " en la institución: " + certificacion.institucion + "<br>";
            });

            let informacionProyectos = "";
            usuario.proyectos.forEach(proyecto => {
                informacionProyectos += proyecto.nombre + "<br>";
            });
            console.log(usuario.departamento)
            //Comilla francesa (``), permite utilizar variables o expresiones en un string
            fila.innerHTML= `
                <td> ${usuario.nombre} </td>
                <td> ${usuario.correo} </td>
                <td> ${usuario.departamento?.nombre || ""} </td>
                <td> ${informacionCertificaciones} </td>
                <td> ${informacionProyectos} </td>
            `;
            /*
             usuario.departamento?.nombre || "" == 
             
            if (usario.departamento !== undefined){
                if (usuario.departamento.nombre === undefined){  
                    return "";
                }
                else{
                    return usuario.departamento.nombre;
                }
            } else{
                    return "";
            }

             */
            tablaEmpleados.appendChild(fila); 
        })
    });
}

cargarTabla();