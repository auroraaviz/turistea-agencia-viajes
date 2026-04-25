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

document.addEventListener("DOMContentLoaded", () => {
  const btn =
    document.getElementById("btnTodosPaquetes");

  const contenido =
    document.getElementById("contenido");

  if (!btn || !contenido) return;

  btn.addEventListener("click", async (e) => {
    e.preventDefault();

    contenido.innerHTML = spinner();

    try {
      const respuesta =
        await obtener("/api/paquetes/get.php");

      state.paquetes =
        respuesta.data || respuesta;

      state.listaActual =
        state.paquetes;
     
      state.destinos = await obtenerDestinos();  

      state.paginaActual = 1;

      refrescar();

    } catch (error) {
      console.log(error);

      contenido.innerHTML =
        alerta("Error al cargar paquetes.");
    }
  });

  function refrescar() {
    contenido.innerHTML =
      renderTabla(
        state.listaActual,
        state.paginaActual,
        state.porPagina,
        state.destinos
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
            state.paquetes,
            filtros
          );

        state.paginaActual = 1;

        refrescar();
      });
    }

    if (btnLimpiar) {
      btnLimpiar.addEventListener("click", () => {

        state.listaActual =
          state.paquetes;

        state.paginaActual = 1;

        refrescar();
      });
    }
  }
});