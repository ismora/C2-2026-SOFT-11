const inputNombre = document.getElementById("nombreCertificacion");
const inputFechaVigencia = document.getElementById("vigencia");
const inputInstitucion = document.getElementById("institucion");

const inputDescripcion = document.querySelector("#descripcion");
// const inputDescripcion = document.getElementById("descripcion");
const btnGuardarCertificacion = document.querySelector("#btnGuardar");

const inputsRequeridos = document.querySelectorAll("input[required]"); // Selecccionar todos los input obligatorios

const modalExito = new bootstrap.Modal(document.getElementById("successModal"));

function validar(){
    let error = false;
    for(let i = 0; i < inputsRequeridos.length; i++){
        if(inputsRequeridos[i].value === ""){
            error = true;
            Swal.fire({
                title: "No se puede registrar la certificación",
                text: "Por favor complete los campos resaltados.",
                icon: "warning",
                confirmButtonText: "Aceptar"
            });
        }
    }
    resaltarCamposVacios();
    if (error == false){
        registrarCertificacion();
    }

}

function resaltarCamposVacios(){
    // Nombre de la certificación 
    if (inputNombre.value.trim() === ""){
        inputNombre.classList.add("input-error");
    } else{
        inputNombre.classList.remove("input-error");
    }

    // Institución 
    if (inputInstitucion.value.trim() === ""){
        inputInstitucion.classList.add("input-error");
    } else{
        inputInstitucion.classList.remove("input-error");
    }

    // Fecha 
    if (inputFechaVigencia.value.trim() === ""){
        inputFechaVigencia.classList.add("input-error");
    } else{
        inputFechaVigencia.classList.remove("input-error");
    }

}

function registrarCertificacion(){
    modalExito.show();
}


btnGuardarCertificacion.addEventListener("click", validar);