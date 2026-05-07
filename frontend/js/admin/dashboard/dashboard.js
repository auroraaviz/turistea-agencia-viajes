import { obtener } from "../../utils/fetch.js";
import { renderDashboard } from "./dashboardRender.js";

console.log("modulo dashboard cargado");

document.addEventListener("DOMContentLoaded", () => {
  const btnResumen = document.getElementById("btnResumenGeneral");
  const contenido = document.getElementById("contenido");
  const params = new URLSearchParams(window.location.search);

  if (!btnResumen || !contenido) return;

  btnResumen.addEventListener("click", async (e) => {
    e.preventDefault();
    cargarDashboard();
  });

  // Cargar dashboard por defecto al entrar al admin
  if (!params.has("finanzas")) {
    cargarDashboard();
  }

  async function cargarDashboard() {
    contenido.dataset.vista = "dashboard";
    contenido.innerHTML = `
      <div class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
        <p class="text-muted mt-2">Cargando dashboard...</p>
      </div>
    `;

    try {
      const data = await obtener("/api/dashboard/stats.php");

      if (!data) {
        contenido.innerHTML = `
          <div class="alert alert-danger text-center mt-4">
            Error al cargar los datos del dashboard.
          </div>
        `;
        return;
      }

      if (contenido.dataset.vista !== "dashboard") return;
      contenido.innerHTML = renderDashboard(data);
    } catch (error) {
      console.log(error);
      if (contenido.dataset.vista !== "dashboard") return;
      contenido.innerHTML = `
        <div class="alert alert-danger text-center mt-4">
          Error al cargar los datos del dashboard.
        </div>
      `;
    }
  }
});
