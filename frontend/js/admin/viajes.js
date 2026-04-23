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

      if (!respuesta) {
        throw new Error("No se pudieron cargar datos");
      }

      const paquetes = respuesta.data || respuesta;

      const porPagina = 7;
      let paginaActual = 1;

      function renderizarTabla(lista = paquetes) {
        const totalPaginas = Math.ceil(lista.length / porPagina) || 1;

        if (paginaActual > totalPaginas) {
          paginaActual = 1;
        }

        const inicio = (paginaActual - 1) * porPagina;
        const fin = inicio + porPagina;
        const visibles = lista.slice(inicio, fin);

        let html = `
          <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">

            <div>
              <h2 class="fw-bold mb-0">Todos los paquetes</h2>
              <small class="text-muted">
                Total: ${lista.length} viajes disponibles
              </small>
            </div>

            <button
              class="btn btn-outline-primary"
              id="btnToggleFiltros"
            >
              <i class="bi bi-funnel-fill me-2"></i>
              Mostrar filtros
            </button>

          </div>

          <!-- PANEL FILTROS -->
          <div
            id="panelFiltros"
            class="shadow-sm border-0 mb-4 d-none"
          >

            <div class="card-body">

              <div class="row g-3 align-items-center">

                <div class="col-12 col-md-3">
                  <label class="form-label fw-semibold">
                    Precio desde
                  </label>

                  <input
                    type="number"
                    class="form-control"
                    id="filtroPrecioMin"
                    placeholder="0 €"
                  >
                </div>

                <div class="col-12 col-md-3">
                  <label class="form-label fw-semibold">
                    Precio hasta
                  </label>

                  <input
                    type="number"
                    class="form-control"
                    id="filtroPrecioMax"
                    placeholder="9999 €"
                  >
                </div>

                <div class="col-12 col-md-3">
                  <label class="form-label fw-semibold">
                    Estado
                  </label>

                  <select class="form-select" id="filtroEstado">
                    <option value="">Todos</option>
                    <option value="1">Activo</option>
                    <option value="0">Inactivo</option>
                  </select>
                </div>

                <div class="col-12 col-md-3">
                  <label class="form-label fw-semibold">
                    Destino
                  </label>

                  <select class="form-select" id="filtroDestino">
                    <option value="">Todos</option>
                    <option value="Canarias">Canarias</option>
                    <option value="Mallorca">Mallorca</option>
                    <option value="París">París</option>
                    <option value="Roma">Roma</option>
                    <option value="Londres">Londres</option>
                    <option value="Caribe">Caribe</option>
                  </select>
                </div>

                <div class="col-12 d-flex gap-2 flex-wrap">

                  <button
                    class="btn btn-primary"
                    id="btnAplicarFiltros"
                  >
                    <i class="bi bi-check-circle me-2"></i>
                    Aplicar filtros
                  </button>

                  <button
                    class="btn btn-outline-secondary"
                    id="btnLimpiarFiltros"
                  >
                    <i class="bi bi-arrow-clockwise me-2"></i>
                    Limpiar
                  </button>

                </div>

              </div>

            </div>

          </div>

          <!-- TABLA -->
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

              <td class="fw-bold text-muted">
                ${p.id}
              </td>

              <td>
                <img
                  src="${imagen}"
                  alt="${p.titulo}"
                  style="width:100px;height:70px;object-fit:cover;border-radius:10px;"
                >
              </td>

              <td class="fw-semibold">
                ${p.titulo}
              </td>

              <td>
                <i class="bi bi-geo-alt-fill text-danger me-1"></i>
                ${p.destino}
              </td>

              <td>${p.noches}</td>

              <td class="fw-bold text-primary">
                ${p.precio}€
              </td>

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

        /* PAGINACIÓN */
        if (totalPaginas > 1) {
          html += `
            <nav class="mt-4">

              <ul class="pagination justify-content-center">

                <li class="page-item ${paginaActual === 1 ? "disabled" : ""}">
                  <a href="#" class="page-link" id="paginaAnterior">
                    &laquo;
                  </a>
                </li>
          `;

          for (let i = 1; i <= totalPaginas; i++) {
            html += `
              <li class="page-item ${i === paginaActual ? "active" : ""}">
                <a
                  href="#"
                  class="page-link pagina-numero"
                  data-pagina="${i}"
                >
                  ${i}
                </a>
              </li>
            `;
          }

          html += `
                <li class="page-item ${paginaActual === totalPaginas ? "disabled" : ""}">
                  <a href="#" class="page-link" id="paginaSiguiente">
                    &raquo;
                  </a>
                </li>

              </ul>

            </nav>
          `;
        }

        contenido.innerHTML = html;

        activarToggleFiltros();
        activarFiltros();
        activarPaginacion(lista);
      }

      function activarToggleFiltros() {
        const btnToggle = document.getElementById("btnToggleFiltros");
        const panel = document.getElementById("panelFiltros");

        if (!btnToggle || !panel) return;

        btnToggle.addEventListener("click", () => {
          panel.classList.toggle("d-none");

          if (panel.classList.contains("d-none")) {
            btnToggle.innerHTML = `
              <i class="bi bi-funnel-fill me-2"></i>
              Mostrar filtros
            `;
          } else {
            btnToggle.innerHTML = `
              <i class="bi bi-x-circle me-2"></i>
              Ocultar filtros
            `;
          }
        });
      }

      function activarFiltros() {
        const btnFiltrar = document.getElementById("btnAplicarFiltros");
        const btnLimpiar = document.getElementById("btnLimpiarFiltros");

        if (btnFiltrar) {
          btnFiltrar.addEventListener("click", () => {
            const min =
              parseFloat(document.getElementById("filtroPrecioMin").value) || 0;

            const max =
              parseFloat(document.getElementById("filtroPrecioMax").value) ||
              999999;

            const estado =
              document.getElementById("filtroEstado").value;

            const destino =
              document.getElementById("filtroDestino").value;

            const filtrados = paquetes.filter((p) => {
              const precio = parseFloat(p.precio);

              const cumplePrecio =
                precio >= min && precio <= max;

              const cumpleEstado =
                estado === "" || String(p.activo) === estado;

              const cumpleDestino =
                destino === "" || p.destino === destino;

              return (
                cumplePrecio &&
                cumpleEstado &&
                cumpleDestino
              );
            });

            paginaActual = 1;
            renderizarTabla(filtrados);
          });
        }

        if (btnLimpiar) {
          btnLimpiar.addEventListener("click", () => {
            paginaActual = 1;
            renderizarTabla(paquetes);
          });
        }
      }

      function activarPaginacion(lista) {
        const totalPaginas =
          Math.ceil(lista.length / porPagina) || 1;

        const anterior =
          document.getElementById("paginaAnterior");

        const siguiente =
          document.getElementById("paginaSiguiente");

        const paginas =
          document.querySelectorAll(".pagina-numero");

        if (anterior) {
          anterior.addEventListener("click", (e) => {
            e.preventDefault();

            if (paginaActual > 1) {
              paginaActual--;
              renderizarTabla(lista);
            }
          });
        }

        if (siguiente) {
          siguiente.addEventListener("click", (e) => {
            e.preventDefault();

            if (paginaActual < totalPaginas) {
              paginaActual++;
              renderizarTabla(lista);
            }
          });
        }

        paginas.forEach((btnPagina) => {
          btnPagina.addEventListener("click", (e) => {
            e.preventDefault();

            paginaActual = parseInt(
              btnPagina.dataset.pagina
            );

            renderizarTabla(lista);
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