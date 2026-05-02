export function spinner() {
  return `
    <div class="d-flex justify-content-center align-items-center" style="height:200px;">
      <div class="spinner-border text-info" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>
  `;
}
 
export function alerta(mensaje, tipo = 'danger') {
  return `
    <div class="alert alert-${tipo} mt-4" role="alert">
      <i class="bi bi-exclamation-triangle-fill me-2"></i>
      ${mensaje}
    </div>
  `;
}
