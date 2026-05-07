import { obtener, crear } from '../../utils/fetch.js';
import { badgeEstado, textoEstado } from './reservasHelpers.js';

export function activarModal() {
    document.querySelectorAll('.btn-ver-reserva').forEach((btn) => {
        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const id = btn.dataset.id;
            await abrirModal(id);
        });
    });

    // Click en fila también abre modal
    document.querySelectorAll('.fila-reserva').forEach((fila) => {
        fila.addEventListener('click', async () => {
            await abrirModal(fila.dataset.id);
        });
    });
}

async function abrirModal(id) {
    // Eliminar modal previo si existe
    document.getElementById('modalReservaDetalle')?.remove();

    const r = await obtener(`/api/reservas/get.php?id=${id}`);
    if (!r) return;

    const fechaReserva = r.fecha_reserva
        ? new Date(r.fecha_reserva).toLocaleDateString('es-ES')
        : '-';
    const fechaSalida = r.fecha_salida
        ? new Date(r.fecha_salida).toLocaleDateString('es-ES')
        : '-';

    const modal = document.createElement('div');
    modal.id = 'modalReservaDetalle';
    modal.innerHTML = `
    <div class="modal fade" id="modalReserva" tabindex="-1">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title fw-bold">
                        Reserva #${r.id}
                        <span class="badge ${badgeEstado(r.estado)} ms-2">${textoEstado(r.estado)}</span>
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="row g-3">
                        <div class="col-md-6">
                            <p class="text-uppercase fw-bold text-muted mb-1" style="font-size:.75rem">Cliente</p>
                            <p class="mb-0 fw-semibold">${r.nombre} ${r.apellidos ?? ''}</p>
                            <p class="mb-0 text-muted small">${r.email}</p>
                        </div>
                        <div class="col-md-6">
                            <p class="text-uppercase fw-bold text-muted mb-1" style="font-size:.75rem">Paquete</p>
                            <p class="mb-0 fw-semibold">${r.paquete_titulo}</p>
                            <p class="mb-0 text-muted small">${r.destino ?? ''} · Salida: ${fechaSalida}</p>
                        </div>
                        <div class="col-md-4">
                            <p class="text-uppercase fw-bold text-muted mb-1" style="font-size:.75rem">Viajeros</p>
                            <p class="mb-0 fw-semibold">${r.num_viajeros}</p>
                        </div>
                        <div class="col-md-4">
                            <p class="text-uppercase fw-bold text-muted mb-1" style="font-size:.75rem">Total</p>
                            <p class="mb-0 fw-semibold">${parseFloat(r.precio_total).toFixed(2)}€</p>
                        </div>
                        <div class="col-md-4">
                            <p class="text-uppercase fw-bold text-muted mb-1" style="font-size:.75rem">Fecha reserva</p>
                            <p class="mb-0 fw-semibold">${fechaReserva}</p>
                        </div>
                    </div>

                    <hr class="my-3">

                    <p class="text-uppercase fw-bold text-muted mb-2" style="font-size:.75rem">Cambiar estado</p>
                    <div class="d-flex gap-2 flex-wrap">
                        ${r.estado !== 'PENDIENTE'  ? `<button class="btn btn-warning btn-sm btn-cambiar-estado" data-id="${r.id}" data-estado="PENDIENTE">Marcar pendiente</button>` : ''}
                        ${r.estado !== 'CONFIRMADA' ? `<button class="btn btn-success btn-sm btn-cambiar-estado" data-id="${r.id}" data-estado="CONFIRMADA">Confirmar</button>` : ''}
                        ${r.estado !== 'CANCELADA'  ? `<button class="btn btn-danger btn-sm btn-cambiar-estado"  data-id="${r.id}" data-estado="CANCELADA">Cancelar</button>` : ''}
                    </div>
                </div>
            </div>
        </div>
    </div>`;

    document.body.appendChild(modal);

    const bsModal = new bootstrap.Modal(document.getElementById('modalReserva'));
    bsModal.show();

    // Limpiar del DOM al cerrar
    document.getElementById('modalReserva').addEventListener('hidden.bs.modal', () => {
        modal.remove();
    });

    // Botones de cambio de estado
    modal.querySelectorAll('.btn-cambiar-estado').forEach((btn) => {
        btn.addEventListener('click', async () => {
            btn.disabled = true;
            const res = await crear('/api/reservas/update.php', {
                id:     parseInt(btn.dataset.id),
                estado: btn.dataset.estado
            });
            const json = res ? (() => { try { return JSON.parse(res); } catch { return null; } })() : null;

            if (json?.ok) {
                bsModal.hide();
                document.dispatchEvent(new CustomEvent('reservas:actualizar'));
            } else {
                btn.disabled = false;
                alert('Error al actualizar el estado');
            }
        });
    });
}