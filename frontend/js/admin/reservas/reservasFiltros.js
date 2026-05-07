export function leerFiltros() {
    return {
        busqueda: document.getElementById('filtroReservaBusqueda')?.value.trim().toLowerCase() ?? '',
        estado:   document.getElementById('filtroReservaEstado')?.value ?? '',
    };
}

export function aplicarFiltros(reservas, filtros) {
    return reservas.filter((r) => {
        const texto = `${r.nombre} ${r.apellidos ?? ''} ${r.email} ${r.paquete_titulo}`.toLowerCase();
        const pasaBusqueda = !filtros.busqueda || texto.includes(filtros.busqueda);
        const pasaEstado   = !filtros.estado   || r.estado === filtros.estado;
        return pasaBusqueda && pasaEstado;
    });
}