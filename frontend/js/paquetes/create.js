import { crear } from "../utils/fetch.js";

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("formPaquete");
  const mensaje = document.getElementById("mensaje");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const datos = {
      titulo: document.getElementById("titulo").value.trim(),
      destino: document.getElementById("destino").value.trim(),
      descripcion: document.getElementById("descripcion").value.trim(),
      imagen: document.getElementById("imagen").value.trim(),
      hotel_nombre: document.getElementById("hotel_nombre").value.trim(),
      hotel_estrellas: parseInt(document.getElementById("hotel_estrellas").value),
      hotel_regimen: document.getElementById("hotel_regimen").value.trim(),
      hotel_imagen: document.getElementById("hotel_imagen").value.trim(),
      fecha_salida: document.getElementById("fecha_salida").value,
      fecha_regreso: document.getElementById("fecha_regreso").value,
      plazas_disponibles: parseInt(document.getElementById("plazas_disponibles").value),
      plazas_totales: parseInt(document.getElementById("plazas_totales").value),
      precio: parseFloat(document.getElementById("precio").value),
      descuento: parseInt(document.getElementById("descuento").value),
      activo: document.getElementById("activo").checked ? 1 : 0,
      vuelo_incluido: document.getElementById("vuelo_incluido").checked ? 1 : 0,
      salida_desde: document.getElementById("salida_desde").value.trim(),
      cerca_playa: document.getElementById("cerca_playa").checked ? 1 : 0
    };

    const respuesta = await crear(
      "/turistea/JR_M26_AgenciaViajes/api/paquetes/create.php",
      datos
    );

    if (respuesta && respuesta.success) {
      mensaje.innerHTML = `
        <div class="alert alert-success">
          Paquete creado correctamente con ID: ${respuesta.id}
        </div>
      `;
      form.reset();
    } else {
      mensaje.innerHTML = `
        <div class="alert alert-danger">
          Error al crear el paquete
        </div>
      `;
    }
  });
});