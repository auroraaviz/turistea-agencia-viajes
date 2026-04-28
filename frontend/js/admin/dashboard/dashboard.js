import { obtener } from "../../utils/fetch.js";
import { renderDashboard } from "./dashboardRender.js";

console.log("modulo dashboard cargado");

document.addEventListener("DOMContentLoaded", () => {
  const btnResumen = document.getElementById("btnResumenGeneral");
  const contenido = document.getElementById("contenido");

  if (!btnResumen || !contenido) return;

  btnResumen.addEventListener("click", async (e) => {
    e.preventDefault();
    cargarDashboard();
  });

  // Cargar dashboard por defecto al entrar al admin
  cargarDashboard();

  async function cargarDashboard() {
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

      contenido.innerHTML = renderDashboard(data);
    } catch (error) {
      console.log(error);
      contenido.innerHTML = `
        <div class="alert alert-danger text-center mt-4">
          Error al cargar los datos del dashboard.
        </div>
      `;
    }
  }
});
