import { obtener } from "../../utils/fetch.js";
import { renderAlertas } from "./alertasRender.js";

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("btnAlertas");
  const contenido = document.getElementById("contenido");

  if (!btn || !contenido) return;

  btn.addEventListener("click", async (e) => {
    e.preventDefault();

    contenido.innerHTML = `
      <div class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
        <p class="text-muted mt-2">Cargando alertas...</p>
      </div>
    `;

    try {
      const data = await obtener("/api/dashboard/stats.php");

      if (!data) {
        contenido.innerHTML = `
          <div class="alert alert-danger text-center mt-4">
            Error al cargar las alertas.
          </div>
        `;
        return;
      }

      contenido.innerHTML = renderAlertas(data);
    } catch (error) {
      console.log(error);
      contenido.innerHTML = `
        <div class="alert alert-danger text-center mt-4">
          Error al cargar las alertas.
        </div>
      `;
    }
  });
});
