export function spinner() {
    return `<div class="text-center py-5">
        <div class="spinner-border text-primary" role="status"></div>
        <p class="mt-3 text-muted">Cargando reservas...</p>
    </div>`;
}

export function alerta(msg) {
    return `<div class="alert alert-danger m-4">${msg}</div>`;
}