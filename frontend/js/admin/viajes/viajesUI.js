export function spinner() {
  return `
    <div class="text-center p-5">
      <div class="spinner-border text-primary"></div>
      <p class="mt-3">
        Cargando viajes...
      </p>
    </div>
  `;
}

export function alerta(msg) {
  return `
    <div class="alert alert-danger">
      ${msg}
    </div>
  `;
}

export function activarToggleFiltros() {
  const btn =
    document.getElementById("btnToggleFiltros");

  const panel =
    document.getElementById("panelFiltros");

  if (!btn || !panel) return;

  btn.addEventListener("click", () => {
    panel.classList.toggle("panel-filtros-abierto");

    const abierto =
      panel.classList.contains("panel-filtros-abierto");

    panel.setAttribute(
      "aria-hidden",
      abierto ? "false" : "true"
    );

    btn.innerHTML =
      abierto
        ? `
          <i class="bi bi-x-circle me-2"></i>
          Ocultar filtros
        `
        : `
          <i class="bi bi-funnel-fill me-2"></i>
          Mostrar filtros
        `;
  });
}

export function toast(msg) {
  alert(msg);
}
