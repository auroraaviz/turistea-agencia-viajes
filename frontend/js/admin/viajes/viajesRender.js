/*
=========================================
RENDER TABLA ADMIN VIAJES
-----------------------------------------
Responsabilidad:
- Pintar tabla HTML de paquetes
- Aplicar paginación visual
- Mostrar filtros y resultados
- Preparar botones de acciones

Solo renderiza interfaz.
No consulta API directamente.
=========================================
*/


import { obtenerImagen, badgeEstado, textoEstado } from './helpers.js';


export function renderTabla(lista, paginaActual, porPagina, destinos, opciones = {}) {
  const mostrarEstado =
    !opciones.ocultarEstado;

  const mostrarFiltroEstado =
    !opciones.ocultarFiltroEstado;

  const mostrarImagen =
    !opciones.ocultarImagen;

  const titulo =
    opciones.titulo || "Gestión de paquetes";

  const totalPaginas = Math.ceil(lista.length / porPagina) || 1;

  const inicio = (paginaActual - 1) * porPagina;

  const fin = inicio + porPagina;

  const visibles = lista.slice(inicio, fin);

  let html = `
    <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">

      <div>
        <h2 class="fw-bold mb-0">
          ${titulo}
        </h2>

        <small class="text-muted">
          Total: ${lista.length} paquetes registrados
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

    <div
      id="panelFiltros"
      class="panel-filtros shadow-sm border-0 mb-4"
      aria-hidden="true"
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

          ${
            mostrarFiltroEstado
            ? `
              <div class="col-12 col-md-3">
                <label class="form-label fw-semibold">
                  Estado
                </label>

                <select
                  class="form-select"
                  id="filtroEstado"
                >
                  <option value="">
                    Todos
                  </option>
                  <option value="1">
                    Activo
                  </option>
                  <option value="0">
                    Inactivo
                  </option>
                </select>
              </div>
            `
            : ""
          }

          <div class="col-12 col-md-3">
            <label class="form-label fw-semibold">
              Destino
            </label>

            <select
  class="form-select"
  id="filtroDestino"
>
  <option value="">
    Todos
  </option>

  ${destinos.map(d => `
<option value="${d.destino}">
  ${d.destino}
</option>
`).join("")}

</select>
          </div>

          <div class="col-12 d-flex gap-2 flex-wrap">

            <button
              class="btn btn-primary"
              id="btnAplicarFiltros"
            >
              Aplicar filtros
            </button>

            <button
              class="btn btn-outline-secondary"
              id="btnLimpiarFiltros"
            >
              Limpiar
            </button>

          </div>

        </div>

      </div>

    </div>

    <!-- VISTA TABLA (desktop) -->
    <div class="d-none d-md-block table-responsive shadow-sm rounded bg-white">

      <table class="table table-hover align-middle mb-0 text-center">

        <thead class="table-light">
          <tr>
            <th>ID</th>
            ${mostrarImagen ? "<th>Imagen</th>" : ""}
            <th>Título</th>
            <th>Destino</th>
            <th>Fecha de salida</th>
            <th>Noches</th>
            <th>Precio</th>
            <th>Plazas disponibles</th>
            <th>Plazas totales</th>
            ${mostrarEstado ? "<th>Estado</th>" : ""}
          </tr>
        </thead>

        <tbody>
  `;

  visibles.forEach((p) => {
    html += `
      <tr class="fila-paquete" data-id="${p.id}" style="cursor:pointer;">

        <td class="fw-bold text-muted">
          ${p.id}
        </td>

        ${
          mostrarImagen
          ? `
            <td>
              <img
                src="${obtenerImagen(p)}"
                alt="${p.titulo}"
                style="max-width:100px;height:60px;object-fit:cover;border-radius:10px;"
              >
            </td>
          `
          : ""
        }

        <td class="fw-semibold">
          ${p.titulo}
        </td>

        <td>
          ${p.destino}
        </td>

         <td>
          ${p.fecha_salida}
        </td>

        <td>
          ${p.noches}
        </td>

        <td class="fw-bold ">
          ${p.precio}€
        </td>

        <td>
          ${p.plazas_disponibles ?? '-'}
        </td>

         <td>
          ${p.plazas_totales ?? '-'}
        </td>

        ${
          mostrarEstado
          ? `
            <td>
              <span class="badge ${badgeEstado(p.activo)}">
                ${textoEstado(p.activo)}
              </span>
            </td>
          `
          : ""
        }
      </tr>
    `;
  });

  html += `
        </tbody>

      </table>

    </div>

    <!-- VISTA CARDS (móvil) -->
    <div class="d-md-none">
      <div class="row g-2">
  `;

  visibles.forEach((p) => {
    html += `
      <div class="col-12">
        <div class="card shadow-sm fila-paquete" data-id="${p.id}" style="cursor:pointer;">
          <div class="card-body p-3">
            <div class="d-flex gap-3 align-items-center">
              ${
                mostrarImagen
                ? `
                  <img
                    src="${obtenerImagen(p)}"
                    alt="${p.titulo}"
                    style="width:70px;height:50px;object-fit:cover;border-radius:8px;flex-shrink:0;"
                  >
                `
                : ""
              }
              <div class="flex-grow-1 min-width-0">
                <div class="d-flex justify-content-between align-items-start">
                  <h6 class="fw-semibold mb-1 text-truncate">${p.titulo}</h6>
                  ${
                    mostrarEstado
                    ? `
                      <span class="badge ${badgeEstado(p.activo)} ms-2 flex-shrink-0">
                        ${textoEstado(p.activo)}
                      </span>
                    `
                    : ""
                  }
                </div>
                <small class="text-muted d-block">${p.destino} · ${p.fecha_salida}</small>
                <div class="d-flex justify-content-between align-items-center mt-1">
                  <span class="fw-bold text-primary">${p.precio}€</span>
                  <small class="text-muted">${p.plazas_disponibles ?? '-'}/${p.plazas_totales ?? '-'} plazas</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  });

  html += `
      </div>
    </div>
  `;

  if (totalPaginas > 1) {
    html += `
      <nav class="mt-4">

        <ul class="pagination justify-content-center">

          <li class="page-item ${paginaActual === 1 ? 'disabled' : ''}">
            <a href="#" class="page-link" id="paginaAnterior">
              &laquo;
            </a>
          </li>
    `;

    for (let i = 1; i <= totalPaginas; i++) {
      html += `
        <li class="page-item ${i === paginaActual ? 'active' : ''}">
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
          <li class="page-item ${paginaActual === totalPaginas ? 'disabled' : ''}">
            <a href="#" class="page-link" id="paginaSiguiente">
              &raquo;
            </a>
          </li>

        </ul>

      </nav>
    `;
  }

  return html;
}
