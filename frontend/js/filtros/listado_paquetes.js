import { obtener } from "../utils/fetch.js";
import { BASE } from "../config.js";

function normalizarTexto(texto) {
    return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}

function resolverImagen(ruta) {
    if (!ruta) return '';
    // Quita el "../" del principio y añade la ruta web correcta
    const limpia = ruta.replace(/^\.\.\//,'');
    return `${BASE}/frontend/${limpia}`;
}

document.addEventListener("DOMContentLoaded", async function () {

    const contenedor = document.getElementById("paquetes-container");

    const respuesta = await obtener("/api/paquetes/get.php");
    if (!respuesta) return;

    respuesta.forEach(paquete => {

        const col = document.createElement("div");
        col.className = "col-12 col-md-6 col-lg-3";

        col.innerHTML = `
            <a href="${BASE}/frontend/pages/detalle.html?id=${paquete.id}" class="text-decoration-none text-dark">
            <div class="card h-100"
                data-destino="${paquete.destino}"
                data-fecha-inicio="${paquete.fecha_salida}"
                data-fecha-fin="${paquete.fecha_regreso}"
                data-categoria="${paquete.categoria ?? ''}">

                <div class="ratio ratio-16x9">
                    <img src="${resolverImagen(paquete.imagen)}" class="card-img-top object-fit-cover">
                </div>

                <div class="card-body">
                    <h5 class="card-title fw-bold">${paquete.titulo}</h5>
                    <p class="card-text text-muted small">${paquete.descripcion}</p>
                </div>

            </div>
        </a>
        `;

        contenedor.appendChild(col);
    });

    document.querySelector('.btn-buscar').addEventListener('click', function () {
        const destino = normalizarTexto(document.getElementById('filtro-destino').value.trim());
        const fechaInicioInput = document.getElementById('fecha-inicio').value;
        const fechaFinInput = document.getElementById('fecha-fin').value;

        let fechaInicioFinal = null;
        let fechaFinFinal = null;

        if(fechaInicioInput) {
            const f = new Date (fechaInicioInput);
            f.setDate(f.getDate()-7);
            fechaInicioFinal = f;
        }

        if (fechaFinInput) {
            const f = new Date(fechaFinInput);
            f.setDate(f.getDate() +7);
            fechaFinFinal = f;
        }

        const categoriaActiva = document.querySelector('.categoria.activa')?.dataset.categoria ?? null;

        document.querySelectorAll('#paquetes-container .col-12').forEach(function (col) {
            const card = col.querySelector('.card');
            let mostrar = true;

            const destinoCard = normalizarTexto(card.dataset.destino || "");
            if (destino && !destinoCard.includes(destino)) mostrar = false;

            if(fechaInicioFinal && card.dataset.fechaInicio) {
                if (new Date(card.dataset.fechaInicio) < fechaInicioFinal) mostrar = false;
            }

            if (fechaFinFinal && card.dataset.fechaFin) {
                if (new Date(card.dataset.fechaFin) > fechaFinFinal) mostrar = false;
            }

        if (categoriaActiva){
            const categoriasCard = (card.dataset.categoria || '').split('|');
            if (!categoriasCard.includes(categoriaActiva)) mostrar = false;
        }

            col.style.display = mostrar ? '' : 'none';
        });
    });

   document.querySelectorAll('.categoria').forEach(function (cat) {
    cat.addEventListener('click', function () {
        // Toggle individual, sin quitar las demás
        cat.classList.toggle('activa');
        document.querySelector('.btn-buscar').click();
    });
}); 
});