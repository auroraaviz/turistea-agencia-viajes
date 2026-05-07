import { obtener } from "../../utils/fetch.js";
import { renderFinanzas } from "./finanzasRender.js";

document.addEventListener("DOMContentLoaded", () => {
  const contenido = document.getElementById("contenido");
  const params = new URLSearchParams(window.location.search);
  const enlaces = [
    ["btnFinanzasIngresos", "ingresos"],
    ["btnFinanzasPagos", "pagos"],
    ["btnFinanzasFacturas", "facturas"]
  ];

  if (!contenido) return;

  enlaces.forEach(([id, seccion]) => {
    const enlace = document.getElementById(id);
    if (!enlace) return;

    enlace.addEventListener("click", (event) => {
      event.preventDefault();
      cargarFinanzas(seccion);
    });
  });

  contenido.addEventListener("click", (event) => {
    const tab = event.target.closest("[data-finanzas-tab]");
    if (!tab) return;
    cargarFinanzas(tab.dataset.finanzasTab);
  });

  if (params.has("finanzas")) {
    const seccion = params.get("finanzas") || "ingresos";
    cargarFinanzas(["ingresos", "pagos", "facturas"].includes(seccion) ? seccion : "ingresos");
  }

  async function cargarFinanzas(seccion = "ingresos") {
    contenido.dataset.vista = "finanzas";
    contenido.innerHTML = `
      <div class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
        <p class="text-muted mt-2">Cargando finanzas...</p>
      </div>
    `;

    try {
      const data = await obtener("/api/finanzas/stats.php");

      if (!data) {
        contenido.innerHTML = `
          <div class="alert alert-danger text-center mt-4">
            Error al cargar los datos financieros.
          </div>
        `;
        return;
      }

      if (contenido.dataset.vista !== "finanzas") return;
      contenido.innerHTML = renderFinanzas(data, seccion);
    } catch (error) {
      console.log(error);
      if (contenido.dataset.vista !== "finanzas") return;
      contenido.innerHTML = `
        <div class="alert alert-danger text-center mt-4">
          Error al cargar los datos financieros.
        </div>
      `;
    }
  }
});
