import {state} from './clientesState.js';
import {spinner, alerta} from './clientesUI.js';
import {renderTabla} from './clientesRender.js';
import {leerFiltros, aplicarFiltros} from './filtros.js';
import {activarPaginacion} from './clientesPaginacion.js';
import {activarEventosTabla} from './clientesEventos.js';

console.log('modulo clientes cargado');

document.addEventListener('DOMContentLoaded', () => {
    const btnClientes = document.getElementById('btnTodosClientes');
    const contenido = document.getElementById('contenido');

    if (!btnClientes || !contenido) return;

    btnClientes.addEventListener('click', async (e) => {
        e.preventDefault();
        contenido.innerHTML = spinner();
    
        try { 
            const res = await fetch('/turistea/turistea/api/usuarios/get.php');
            state.usuarios = await res.json();
            state.listaActual = [...state.usuarios];
            state.paginaActual = 1;

            refrescar();
        } catch (err) {
            console.error(err);
            contenido.innerHTML = alerta('Error al cargar usuarios');
        }
    });

    // BLOQUEADOS
    document.getElementById('btnBloqueados')?.addEventListener('click', async (e) => {
    e.preventDefault();
    contenido.innerHTML = spinner();
    try {
        const res = await fetch('/turistea/turistea/api/usuarios/get.php');
        state.usuarios = await res.json();
        state.listaActual = state.usuarios.filter(u => u.activo == 0);
        state.paginaActual = 1;
        refrescar();
    } catch (err) {
        contenido.innerHTML = alerta('Error al cargar usuarios bloqueados.');
    }
});

// CLIENTES (rol usuario)
    document.getElementById('btnSoloClientes')?.addEventListener('click', async (e) => {
    e.preventDefault();
    contenido.innerHTML = spinner();
    try {
        const res = await fetch('/turistea/turistea/api/usuarios/get.php');
        state.usuarios = await res.json();
        state.listaActual = state.usuarios.filter(u => (u.rol ?? 'usuario') === 'usuario');
        state.paginaActual = 1;
        refrescar();
    } catch (err) {
        contenido.innerHTML = alerta('Error al cargar clientes.');
    }
});

// ADMINISTRADORES
    document.getElementById('btnAdministradores')?.addEventListener('click', async (e) => {
    e.preventDefault();
    contenido.innerHTML = spinner();
    try {
        const res = await fetch('/turistea/turistea/api/usuarios/get.php');
        state.usuarios = await res.json();
        state.listaActual = state.usuarios.filter(u => u.rol === 'admin');
        state.paginaActual = 1;
        refrescar();
    } catch (err) {
        contenido.innerHTML = alerta('Error al cargar administradores.');
    }
});


    //Evento personalizado que se lanza tras guardar o bloquear
    document.addEventListener('clientes:actualizar', () => {
        state.listaActual = aplicarFiltros(state.usuarios, leerFiltros());
        refrescar();
    });

    function refrescar() {
        contenido.innerHTML = renderTabla(
            state.listaActual,
            state.paginaActual,
            state.porPagina
        );

        activarToggleFiltros();
        activarFiltros();
        activarPaginacion(state, refrescar);
        activarEventosTabla();
    }

    function activarToggleFiltros() {
        const btn = document.getElementById('btnToggleFiltros');
        const panel = document.getElementById('panelFiltros');
        if (!btn || !panel) return;

        btn.addEventListener('click', () => {
            const oculto = panel.classList.toggle('d-none');
            btn.innerHTML = oculto
            ? '<i class="bi bi-funnel-fill me-2"></i>Mostrar filtros'
            : '<i class="bi bi-funnel me-2"></i>Ocultar filtros';
        });
    }

    function activarFiltros() {
        const btnAplicar = document.getElementById('btnAplicarFiltros');
        const btnLimpiar = document.getElementById('btnLimpiarFiltros');

        if (btnAplicar) {
            btnAplicar.addEventListener('click', () => {
                state.listaActual = aplicarFiltros(state.usuarios, leerFiltros());
                state.paginaActual = 1;
                refrescar();
            });
        }

        if (btnLimpiar) {
            btnLimpiar.addEventListener('click', () => {
                state.listaActual = [...state.usuarios];
                state.paginaActual = 1;
                refrescar();
            });
        }
    }
});