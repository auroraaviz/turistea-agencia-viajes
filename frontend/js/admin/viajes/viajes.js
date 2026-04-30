/*
=========================================
MÓDULO PRINCIPAL GESTIÓN DE VIAJES
-----------------------------------------
Responsabilidad:
- Punto de entrada del panel admin
- Cargar paquetes desde API
- Obtener destinos para filtros
- Mantener estado general
- Lanzar renderizado inicial
- Coordinar paginación y eventos

Este archivo orquesta el módulo,
no contiene lógica visual compleja.
=========================================
*/

import { obtener } from "../../utils/fetch.js";

import { state } from "./viajesState.js";

import { spinner, alerta, activarToggleFiltros }
from "./viajesUI.js";

import { renderTabla }
from "./viajesRender.js";

import {
  leerFiltros,
  aplicarFiltros
} from "./filtros.js";

import {
  activarPaginacion
} from "./viajesPaginacion.js";

import {
  activarEventosTabla
} from "./viajesEventos.js";

import {
  obtenerDestinos
} from "./destinos.js";

console.log("módulo viajes cargado");

// Espera a que el DOM esté disponible
document.addEventListener("DOMContentLoaded", () => {
  const btn =
    document.getElementById("btnTodosPaquetes");

  const btnActivos =
    document.getElementById("btnPaquetesActivos");

  const btnInactivos =
    document.getElementById("btnPaquetesInactivos");

  const contenido =
    document.getElementById("contenido");

  if (!btn || !contenido) return;

  btn.addEventListener("click", (e) => {
    e.preventDefault();

    cargarPaquetes();
  });

  if (btnActivos) {
    btnActivos.addEventListener("click", (e) => {
      e.preventDefault();

      cargarPaquetes("1");
    });
  }

  if (btnInactivos) {
    btnInactivos.addEventListener("click", (e) => {
      e.preventDefault();

      cargarPaquetes("0");
    });
  }

  activarRutaInicial();

  async function cargarPaquetes(estado = "") {
    contenido.innerHTML = spinner();

    try {
      const respuesta =
        await obtener("/api/paquetes/get.php");

      state.paquetes =
        respuesta.data || respuesta;

      state.estadoFijo =
        estado;

      state.vistaCompacta =
        estado !== "";

      state.porPagina =
        state.vistaCompacta ? 12 : 8;

      state.listaActual =
        obtenerBaseActual();
     
      state.destinos = await obtenerDestinos();  

      state.paginaActual = 1;

      refrescar();

    } catch (error) {
      console.log(error);

      contenido.innerHTML =
        alerta("Error al cargar paquetes.");
    }
  }
  
// Refresca tabla según filtros actuales
  function refrescar() {
    contenido.innerHTML =
      renderTabla(
        state.listaActual,
        state.paginaActual,
        state.porPagina,
        state.destinos,
        {
          ocultarEstado:
            state.vistaCompacta,

          ocultarFiltroEstado:
            state.vistaCompacta,

          ocultarImagen:
            state.vistaCompacta,

          titulo:
            obtenerTituloListado()
        }
      );

    activarToggleFiltros();

    activarFiltros();

    activarPaginacion(
      state,
      refrescar
    );
    activarEventosTabla();
  }

  function activarFiltros() {
    const btnFiltrar =
      document.getElementById("btnAplicarFiltros");

    const btnLimpiar =
      document.getElementById("btnLimpiarFiltros");

    if (btnFiltrar) {
      btnFiltrar.addEventListener("click", () => {

        const filtros =
          leerFiltros();

        state.listaActual =
          aplicarFiltros(
            obtenerBaseActual(),
            filtros
          );

        state.paginaActual = 1;

        refrescar();
      });
    }

    if (btnLimpiar) {
      btnLimpiar.addEventListener("click", () => {

        state.listaActual =
          obtenerBaseActual();

        state.paginaActual = 1;

        refrescar();
      });
    }
  }

  function obtenerBaseActual() {
    if (state.estadoFijo === "") {
      return state.paquetes;
    }

    return state.paquetes.filter(
      (paquete) =>
        String(paquete.activo) === state.estadoFijo
    );
  }

  function obtenerTituloListado() {
    if (state.estadoFijo === "1") {
      return "Paquetes activos";
    }

    if (state.estadoFijo === "0") {
      return "Paquetes inactivos";
    }

    return "Gestión de paquetes";
  }

  function activarRutaInicial() {
    const params =
      new URLSearchParams(window.location.search);

    const paquetes =
      params.get("paquetes");

    if (!paquetes) return;

    if (paquetes === "activos") {
      cargarPaquetes("1");
      return;
    }

    if (paquetes === "inactivos") {
      cargarPaquetes("0");
      return;
    }

    if (paquetes === "crear") {
      setTimeout(() => {
        document
          .getElementById("btnCrearPaquete")
          ?.click();
      }, 0);
      return;
    }

    cargarPaquetes();
  }
});
