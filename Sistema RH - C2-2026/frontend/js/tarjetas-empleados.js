const contenedor = document.getElementById("contenedorEmpleados");

function eliminarEmpleado(idEmpleado) {
    fetch(`http://localhost:3000/empleados/${idEmpleado}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => {
        if (!response.ok) {
            Swal.fire({
                icon: "error",
                title: "No se pudo eliminar el empleado",
                confirmButtonText: "Aceptar"
            });
        } else {
            Swal.fire({
                icon: "success",
                title: "Empleado eliminado correctamente",
                confirmButtonText: "Aceptar"
            });
            cargarTarjetas();
        }
    })
    .catch(error => {
        console.log(error);
    });

}

async function cargarTarjetas() {

    fetch("http://localhost:3000/empleados", {
        method: "GET",
        headers: {
            "Content-Type": "Application/json"
        }
    })
    .then(response => response.json())
    .then(listaEmpleados => {
        contenedor.innerHTML = ""; // Limpiar el contenedor

        listaEmpleados.forEach(usuario => {
            const tarjeta = document.createElement("div"); // Crear una tarjeta por empleado 

            // Construir la información de certificaciones
            let informacionCertificaciones = "";
            usuario.certificaciones.forEach(certificacion => {
                informacionCertificaciones +=
                    certificacion.nombre +
                    " en la institución: " +
                    certificacion.institucion +
                    "<br>";
            });
            if (informacionCertificaciones === "") {
                informacionCertificaciones = "No posee certificaciones";
            }

            // Construir la información de proyectos
            let informacionProyectos = "";
            usuario.proyectos.forEach(proyecto => {
                informacionProyectos += proyecto.nombre + "<br>";
            });
            if (informacionProyectos === "") {
                informacionProyectos = "No posee proyectos";
            }

            tarjeta.className = "col-12 col-md-6 col-lg-4";

            tarjeta.innerHTML = `
                <div class="tarjeta-empleado h-100 p-2">

                    <div class="d-flex justify-content-between align-items-center">
                        <p class="m-0 fw-bold">${usuario.nombre}</p>

                        <button class="btn-eliminar">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>

                    <div class="card-body">
                        <p><strong>Correo:</strong><br>${usuario.correo}</p>

                        <p><strong>Departamento:</strong><br>
                        ${usuario.departamento?.nombre || ""}
                        </p>

                        <p><strong>Proyectos</strong></p>
                        ${informacionProyectos}

                    </div>

                    <div class="card-footer">
                        <button class="btn-detalles">
                            Ver certificaciones
                        </button>
                    </div>

                </div>
            `;

            const botonDetalles = tarjeta.querySelector(".btn-detalles");

            botonDetalles.addEventListener("click", () => {
                Swal.fire({
                    icon: "success",
                    title: usuario.nombre,
                    html: `
                        <p><strong>Correo:</strong> ${usuario.correo}</p>

                        <p><strong>Departamento:</strong>
                        ${usuario.departamento?.nombre || ""}</p>

                        <hr>

                        <p><strong>Certificaciones</strong></p>
                        ${informacionCertificaciones}
                    `,
                    confirmButtonText: "Aceptar"
                });

            });

            contenedor.appendChild(tarjeta);

            // Asignar el evento de eliminar al botón
            const botonEliminar = tarjeta.querySelector(".btn-eliminar");

            botonEliminar.addEventListener("click", () => {
                eliminarEmpleado(usuario._id);
            });

        });

    });

}

cargarTarjetas();