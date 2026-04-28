/*
=========================================
EVENTOS DEL MODAL
-----------------------------------------
Responsabilidad:
- Gestionar clicks de pestañas
- Alternar entre modo lectura / edición
- Guardar cambios realizados
- Enviar datos al backend

Módulo controlador del modal
=========================================
*/

import { crear } from "../../utils/fetch.js";


import {
  mostrarDestino,
  mostrarHotel,
  mostrarFechas,
  mostrarPrecio,
  mostrarCategoria,
  mostrarOpcionales
} from "./modalRender.js";

import {
  mostrarFormularioDestino,
  mostrarFormularioHotel,
  mostrarFormularioFechas,
  mostrarFormularioPrecio,
  mostrarFormularioCategoria,
  mostrarFormularioOpcionales
} from "./modalForms.js";


// ===========================
// BOTONES PESTAÑAS
// ===========================
// Asigna eventos click a cada pestaña
// para mostrar la sección correspondiente
export function activarPestanas(botones, paquete) {

  botones.forEach((btn) => {

    btn.onclick = (e) => {

      e.preventDefault();

      botones.forEach((b) => {
        b.classList.remove("active");
      });

      btn.classList.add("active");

      ponerBotonEditarNormal();

      const seccion = btn.dataset.seccion;

      mostrarVista(seccion, paquete);
    };

  });

}


// ===========================
// BOTÓN EDITAR / GUARDAR
// ===========================
// Convierte el modal entre:
// modo lectura -> modo edición
// modo edición -> guardar cambios
export function activarEditar(paquete) {

  const btnEditar =
    document.getElementById("btnEditarModal");

  let editando = false;

  btnEditar.onclick = async () => {

    const seccion = obtenerSeccionActiva();

    if (!editando) {

      editando = true;

      btnEditar.textContent = "Guardar";

      btnEditar.classList.remove(
        "btn-outline-primary"
      );

      btnEditar.classList.add(
        "btn-success"
      );

      mostrarFormulario(seccion, paquete);

      return;
    }

    await guardarCambios(paquete, seccion);
document
.getElementById("btnTodosPaquetes")
.click();

    editando = false;

    ponerBotonEditarNormal();

    mostrarVista(seccion, paquete);
  };

}


// ===========================
// OBTENER SECCIÓN ACTIVA
// ===========================
function obtenerSeccionActiva() {

  const activa =
    document.querySelector(
      "#miModal .btn-group .active"
    );

  return activa.dataset.seccion;
}


// ===========================
// BOTÓN EDITAR NORMAL
// ===========================
function ponerBotonEditarNormal() {

  const btnEditar =
    document.getElementById("btnEditarModal");

  btnEditar.textContent = "Editar";

  btnEditar.classList.remove("btn-success");

  btnEditar.classList.add("btn-outline-primary");
}


// ===========================
// MOSTRAR VISTA NORMAL
// ===========================
function mostrarVista(seccion, paquete) {

  if (seccion === "destino") {
    mostrarDestino(paquete);
  }

  if (seccion === "hotel") {
    mostrarHotel(paquete);
  }

  if (seccion === "fechas") {
    mostrarFechas(paquete);
  }

  if (seccion === "precio") {
    mostrarPrecio(paquete);
  }

  if (seccion === "categoria") {
    mostrarCategoria(paquete);
  }

  if (seccion === "opcionales") {
    mostrarOpcionales(paquete);
  }
}


// ===========================
// MOSTRAR FORMULARIO
// ===========================
function mostrarFormulario(seccion, paquete) {

  if (seccion === "destino") {
    mostrarFormularioDestino(paquete);
  }

  if (seccion === "hotel") {
    mostrarFormularioHotel(paquete);
  }

  if (seccion === "fechas") {
    mostrarFormularioFechas(paquete);
  }

  if (seccion === "precio") {
    mostrarFormularioPrecio(paquete);
  }

  if (seccion === "categoria") {
    mostrarFormularioCategoria(paquete);
  }

  if (seccion === "opcionales") {
    mostrarFormularioOpcionales(paquete);
  }
}


// ===========================
// GUARDAR DATOS
// ===========================
// Lee valores del formulario activo,
// actualiza objeto paquete
// y envía datos a la API PHP
async function guardarCambios(paquete, seccion) {

  if (seccion === "destino") {
    guardarDestino(paquete);
  }

  if (seccion === "hotel") {
    guardarHotel(paquete);
  }

  if (seccion === "fechas") {
    guardarFechas(paquete);
  }

  if (seccion === "precio") {
    guardarPrecio(paquete);
  }

  if (seccion === "categoria") {
    guardarCategoria(paquete);
  }

  if (seccion === "opcionales") {
    guardarOpcionales(paquete);
  }

  const respuesta =
    await crear(
      "/api/paquetes/update.php",
      paquete
    );


  console.log(
    "Respuesta servidor:",
    respuesta
  );
}


// ===========================
// GUARDAR DESTINO
// ===========================
function guardarDestino(paquete) {

  const titulo =
    document.getElementById("editTitulo");

  const destino =
    document.getElementById("editDestino");

  const descripcion =
    document.getElementById("editDescripcion");

  const cercaPlaya =
    document.getElementById("editCercaPlaya");

  const activo =
    document.getElementById("editActivo");

  const imagen =
    document.getElementById("editImagen");

  if (titulo) paquete.titulo = titulo.value;
  if (destino) paquete.destino = destino.value;
  if (descripcion) paquete.descripcion = descripcion.value;
  if (cercaPlaya) paquete.cerca_playa = cercaPlaya.value;
  if (activo) paquete.activo = activo.value;

  if (imagen && imagen.files.length > 0) {
    paquete.imagen =
      "assets/img/" + imagen.files[0].name;
  }
}


// ===========================
// GUARDAR HOTEL
// ===========================
function guardarHotel(paquete) {

  const nombre =
    document.getElementById("editHotelNombre");

  const estrellas =
    document.getElementById("editHotelEstrellas");

  const regimen =
    document.getElementById("editHotelRegimen");

  const detalles =
    document.getElementById("editHotelDetalles");

  const imagen =
    document.getElementById("editHotelImagen");

  if (nombre) paquete.hotel_nombre = nombre.value;
  if (estrellas) paquete.hotel_estrellas = estrellas.value;
  if (regimen) paquete.hotel_regimen = regimen.value;
  if (detalles) paquete.hotel_detalles = detalles.value;

  if (imagen && imagen.files.length > 0) {
    paquete.hotel_imagen =
      "assets/img/hoteles/" + imagen.files[0].name;
  }
}


// ===========================
// GUARDAR FECHAS
// ===========================
function guardarFechas(paquete) {

  const salida =
    document.getElementById("editFechaSalida");

  const regreso =
    document.getElementById("editFechaRegreso");

  const vuelo =
    document.getElementById("editVueloIncluido");

  const salidaDesde =
    document.getElementById("editSalidaDesde");

  if (salida) paquete.fecha_salida = salida.value;
  if (regreso) paquete.fecha_regreso = regreso.value;
  if (vuelo) paquete.vuelo_incluido = vuelo.value;
  if (salidaDesde) paquete.salida_desde = salidaDesde.value;
}


// ===========================
// GUARDAR PRECIO
// ===========================
function guardarPrecio(paquete) {

  const precio =
    document.getElementById("editPrecio");

  const descuento =
    document.getElementById("editDescuento");

  const plazasTotales =
    document.getElementById("editPlazasTotales");

  const plazasDisponibles =
    document.getElementById("editPlazasDisponibles");

  if (precio) paquete.precio = precio.value;
  if (descuento) paquete.descuento = descuento.value;
  if (plazasTotales) paquete.plazas_totales = plazasTotales.value;
  if (plazasDisponibles) paquete.plazas_disponibles = plazasDisponibles.value;
}


// ===========================
// GUARDAR CATEGORIA
// ===========================
function guardarCategoria(paquete) {

  const categoria =
    document.getElementById(
      "editCategoria"
    );

  if (categoria) {

    console.log(
      "VALOR SELECT:",
      categoria.value
    );

    paquete.categoria =
      categoria.value.trim();

    console.log(
      "ENVIANDO:",
      paquete.categoria
    );
  }

}


// ===========================
// GUARDAR OPCIONALES
// ===========================
function guardarOpcionales(paquete) {

  const vuelo =
    document.getElementById("editOpcionalVuelo");

  const playa =
    document.getElementById("editOpcionalPlaya");

  if (vuelo) paquete.vuelo_incluido = vuelo.value;
  if (playa) paquete.cerca_playa = playa.value;
}

// ===========================
// ACTIVAR BOTÓN BORRAR
// ===========================
export function activarBorrar(paquete) {

  const btn =
    document.getElementById(
      "btnBorrarModal"
    );

  if (!btn) return;

  btn.onclick = async () => {

    const ok =
      confirm(
        "¿Seguro que deseas borrar este paquete?"
      );

    if (!ok) return;

    try {

      await crear(
        "/api/paquetes/delete.php",
        { id: paquete.id }
      );

      // cerrar modal
      document
        .querySelector(
          "#miModal .btn-close"
        )
        .click();

      // recargar tabla
      document
        .getElementById(
          "btnTodosPaquetes"
        )
        .click();

    } catch (error) {

      console.log(error);
      alert("Error al borrar");

    }

  };

}