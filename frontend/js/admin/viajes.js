import { obtener } from "../utils/fetch.js";
import { BASE } from "../config.js";

console.log("viajes.js cargado");

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("btnTodosPaquetes");
  const contenido = document.getElementById("contenido");

  if (!btn || !contenido) return;

  btn.addEventListener("click", async (e) => {
    e.preventDefault();

    contenido.innerHTML = `
      <div class="text-center p-5">
        <div class="spinner-border text-primary"></div>
        <p class="mt-3">Cargando viajes...</p>
      </div>
    `;

    try {
      const respuesta = await obtener("/api/paquetes/get.php");
      if (!respuesta) throw new Error("No se pudieron obtener los paquetes");

      const paquetes = respuesta.data || respuesta;
      const porPagina = 7;
      let paginaActual = 1;

      function renderizarTabla() {
        const totalPaginas = Math.ceil(paquetes.length / porPagina);
        const inicio = (paginaActual - 1) * porPagina;
        const fin = inicio + porPagina;
        const visibles = paquetes.slice(inicio, fin);

        let html = `
          <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 class="fw-bold mb-0">Todos los paquetes</h2>
              <small class="text-muted">
                Total: ${paquetes.length} viajes disponibles
              </small>
            </div>

            <button class="btn btn-primary">
              <i class="bi bi-plus-circle me-2"></i>
              Nuevo viaje
            </button>
          </div>

          <div class="table-responsive shadow-sm rounded bg-white">
            <table class="table table-hover align-middle mb-0">
              <thead class="table-light">
                <tr>
                  <th>ID</th>
                  <th>Imagen</th>
                  <th>Título</th>
                  <th>Destino</th>
                  <th>Noches</th>
                  <th>Precio</th>
                  <th>Plazas</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
        `;

        visibles.forEach((p) => {
          const imagen = p.imagen
            ? `${BASE}/frontend/${p.imagen.replace(/^\.\.\//, "")}`
            : `${BASE}/frontend/assets/img/default.jpg`;

          html += `
            <tr>
              <td class="fw-bold text-muted">${p.id}</td>

              <td>
                <img
                  src="${imagen}"
                  alt="${p.titulo}"
                  style="width:100px;height:70px;object-fit:cover;border-radius:10px;"
                >
              </td>

              <td class="fw-semibold">${p.titulo}</td>

              <td>
                <i class="bi bi-geo-alt-fill text-danger me-1"></i>
                ${p.destino}
              </td>

              <td>${p.noches}</td>

              <td class="fw-bold text-primary">${p.precio}€</td>

              <td>${p.plazas_disponibles ?? "-"}</td>

              <td>
                <span class="badge ${p.activo == 1 ? "bg-success" : "bg-secondary"}">
                  ${p.activo == 1 ? "Activo" : "Inactivo"}
                </span>
              </td>

              <td>
                <button class="btn btn-sm btn-outline-primary me-1">
                  <i class="bi bi-pencil"></i>
                </button>

                <button class="btn btn-sm btn-outline-danger">
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          `;
        });

        html += `
              </tbody>
            </table>
          </div>
        `;

        if (totalPaginas > 1) {
          html += `
            <nav class="mt-4" aria-label="Paginación de paquetes">
              <ul class="pagination justify-content-center">
                <li class="page-item ${paginaActual === 1 ? "disabled" : ""}">
                  <a class="page-link" href="#" id="paginaAnterior" aria-label="Anterior">
                    <span aria-hidden="true">&laquo;</span>
                  </a>
                </li>
          `;

          for (let i = 1; i <= totalPaginas; i++) {
            html += `
              <li class="page-item ${i === paginaActual ? "active" : ""}">
                <a class="page-link pagina-numero" href="#" data-pagina="${i}">${i}</a>
              </li>
            `;
          }

          html += `
                <li class="page-item ${paginaActual === totalPaginas ? "disabled" : ""}">
                  <a class="page-link" href="#" id="paginaSiguiente" aria-label="Siguiente">
                    <span aria-hidden="true">&raquo;</span>
                  </a>
                </li>
              </ul>
            </nav>
          `;
        }

        contenido.innerHTML = html;
        activarEventosPaginacion(totalPaginas);
      }

      function activarEventosPaginacion(totalPaginas) {
        const btnAnterior = document.getElementById("paginaAnterior");
        const btnSiguiente = document.getElementById("paginaSiguiente");
        const botonesPagina = document.querySelectorAll(".pagina-numero");

        if (btnAnterior) {
          btnAnterior.addEventListener("click", (e) => {
            e.preventDefault();
            if (paginaActual > 1) {
              paginaActual--;
              renderizarTabla();
            }
          });
        }

        if (btnSiguiente) {
          btnSiguiente.addEventListener("click", (e) => {
            e.preventDefault();
            if (paginaActual < totalPaginas) {
              paginaActual++;
              renderizarTabla();
            }
          });
        }

        botonesPagina.forEach((boton) => {
          boton.addEventListener("click", (e) => {
            e.preventDefault();
            paginaActual = parseInt(boton.dataset.pagina);
            renderizarTabla();
          });
        });
      }

      renderizarTabla();

    } catch (error) {
      console.log(error);

      contenido.innerHTML = `
        <div class="alert alert-danger">
          Error al cargar paquetes.
        </div>
      `;
    }
  });
});