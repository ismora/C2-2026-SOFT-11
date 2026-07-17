const btnAsociar = document.getElementById("btnAsociarCertificacionEmpleado");
const listaEmpleados = document.getElementById("sltEmpleado");
const listaCertificaciones = document.getElementById("sltCertificacion");

async function mostrarEmpleados(){
    fetch("http://localhost:3000/empleados", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        } 
    }).then(response => response.json())
    .then(data =>{
        listaEmpleados.innerHTML = ""; 

        data.forEach(empleado =>{
            const nuevaOpcion = document.createElement("option");
            nuevaOpcion.value = empleado.correo;
            nuevaOpcion.textContent = empleado.nombre;
            console.log(nuevaOpcion.value, nuevaOpcion.textContent);
            listaEmpleados.appendChild(nuevaOpcion); 
        }) 
    });
}

async function cargarCertificaciones(){
    fetch("http://localhost:3000/certificaciones", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        } 
    }).then(response => response.json())
    .then(data =>{
        listaCertificaciones.innerHTML = ""; 

        data.forEach(certificacion =>{
            const nuevaOpcion = document.createElement("option");
            nuevaOpcion.value = certificacion._id;
            nuevaOpcion.textContent = certificacion.nombre;
            console.log(nuevaOpcion.value, nuevaOpcion.textContent);
            listaCertificaciones.appendChild(nuevaOpcion); 
        }) 
    });
}

/* 
http://localhost:3000/empleados/agregar-certificacion
{
  "correo": "rose@empresax.net",
  "certificacionId": "6a3db3c94adc0320fe2f8226"
}
*/

async function asociarCertificacionEmpleado(){
    const datosCertificacionUsuario = {
        correo: listaEmpleados.value,
        certificacionId: listaCertificaciones.value
    };
    fetch("http://localhost:3000/empleados/agregar-certificacion", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(datosCertificacionUsuario) 
    }).then(response =>{
        if (response.ok){
            Swal.fire({
                icon: "success",
                title: "Certificación asociada correctamente",
                confirmButtonText: "Aceptar"
            });
            // ToDo: Cuando la certificación esta asociada al empleado no se debería mostrar el mensaje de certificación asicoada correctamente
        }else{
            Swal.fire({
                icon: "error",
                title: "No se puede asociar la certificación",
                text: response,
                confirmButtonText: "Aceptar"
            });
        }
    });
}

cargarCertificaciones();
mostrarEmpleados();
btnAsociar.addEventListener("click", asociarCertificacionEmpleado);