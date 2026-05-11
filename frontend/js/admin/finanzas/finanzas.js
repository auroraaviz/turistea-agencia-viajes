import { obtener } from "../../utils/fetch.js";
import { BASE } from "../../config.js";
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
    const filaFactura = event.target.closest(".fila-factura");
    if (filaFactura) {
      abrirModalFactura(filaFactura.dataset.reservaId, filaFactura.dataset.facturaNumero, filaFactura.dataset.pagoId);
      return;
    }

    const tab = event.target.closest("[data-finanzas-tab]");
    if (!tab) return;
    cargarFinanzas(tab.dataset.finanzasTab);
  });

  contenido.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;

    const filaFactura = event.target.closest(".fila-factura");
    if (!filaFactura) return;

    event.preventDefault();
    abrirModalFactura(filaFactura.dataset.reservaId, filaFactura.dataset.facturaNumero, filaFactura.dataset.pagoId);
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

  function abrirModalFactura(reservaId, facturaNumero, pagoId) {
    if (!reservaId) return;

    document.getElementById("modalFacturaWrap")?.remove();

    const pagoParam = pagoId ? `&pago_id=${encodeURIComponent(pagoId)}` : "";
    const urlInline = `${BASE}/api/reservas/factura_pdf.php?reserva_id=${encodeURIComponent(reservaId)}${pagoParam}&vista=inline`;
    const urlDescarga = `${BASE}/api/reservas/factura_pdf.php?reserva_id=${encodeURIComponent(reservaId)}${pagoParam}`;
    const wrap = document.createElement("div");
    wrap.id = "modalFacturaWrap";
    wrap.innerHTML = `
      <div class="modal fade" id="modalFactura" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
          <div class="modal-content border-0 shadow">
            <div class="modal-header">
              <h5 class="modal-title fw-bold">
                <i class="bi bi-receipt-cutoff me-2 text-primary"></i>${facturaNumero || `Factura reserva #${reservaId}`}
              </h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
            </div>
            <div class="modal-body p-0 bg-light">
              <iframe
                class="factura-pdf-frame"
                src="${urlInline}"
                title="Vista previa de la factura ${facturaNumero || reservaId}">
              </iframe>
            </div>
            <div class="modal-footer">
              <a class="btn btn-primary" href="${urlDescarga}">
                <i class="bi bi-download me-1"></i>Descargar
              </a>
              <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                <i class="bi bi-x-lg me-1"></i>Salir
              </button>
            </div>
          </div>
        </div>
      </div>`;

    document.body.appendChild(wrap);

    const modalEl = document.getElementById("modalFactura");
    const bsModal = new bootstrap.Modal(modalEl);
    modalEl.addEventListener("hidden.bs.modal", () => wrap.remove());
    bsModal.show();
  }
});
