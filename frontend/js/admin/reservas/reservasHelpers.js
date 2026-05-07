export function badgeEstado(estado) {
    const mapa = {
        PENDIENTE:  'bg-warning text-dark',
        CONFIRMADA: 'bg-success',
        CANCELADA:  'bg-danger',
    };
    return mapa[estado] ?? 'bg-secondary';
}

export function textoEstado(estado) {
    const mapa = {
        PENDIENTE:  'Pendiente',
        CONFIRMADA: 'Confirmada',
        CANCELADA:  'Cancelada',
    };
    return mapa[estado] ?? estado;
}