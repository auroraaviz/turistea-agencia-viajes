import { BASE } from "../config.js";

// Limpia rutas relativas que vengan de la BD (ej: ../assets/img/foto.jpg)
function resolverImagen(ruta) {
  return (ruta || '').replace(/^(\.\.\/)+/, '');
}

export async function cargarPaquetes() {
  const contenedor = document.getElementById('contenedor-tarjetas');

  try {
    const respuesta = await fetch(BASE + '/api/paquetes/get.php');
    const paquetes = await respuesta.json();

    contenedor.innerHTML = '';

    paquetes.forEach((paquete) => {
      contenedor.innerHTML += `
        <div class="col-12 col-md-6 col-lg-3">
          <a
            href="${BASE}/frontend/pages/detalle.html?id=${paquete.id}"
            class="card h-100 shadow-sm text-decoration-none text-dark"
            data-destino="${paquete.destino}"
            data-fecha-inicio="${paquete.fecha_salida}"
            data-fecha-fin="${paquete.fecha_regreso}"
            data-categoria="${paquete.categoria ?? ''}"
          >
            <div class="ratio ratio-16x9">
              <img
                src="${BASE}/frontend/${(paquete.imagen || '').replace(/^\.\.\//, '')}"
                class="card-img-top object-fit-cover"
                alt="${paquete.titulo}"
              >
            </div>
            <div class="card-body">
            <h5 class="card-title fw-bold mb-1">${paquete.titulo}</h5>
                <p class="card-text text-muted small mb-2">${paquete.descripcion}</p>
                <p class="small mb-2">
              <i class="bi bi-geo-alt"></i> ${paquete.destino}
                </p>
            ${parseFloat(paquete.descuento) > 0
  ? `<p class="mb-1">
       <span class="text-muted text-decoration-line-through me-1" style="font-size:.85rem">${parseFloat(paquete.precio).toFixed(0)}€</span>
       <span class="badge rounded-pill me-1" style="background:#FF6B6B;color:#fff;font-size:.7rem">-${parseFloat(paquete.descuento).toFixed(0)}%</span>
       <br>
       <span style="color:#0077B6;font-size:1.7rem;font-weight:800">Desde ${(paquete.precio - (paquete.precio * paquete.descuento / 100)).toFixed(0)}€</span>
     </p>`
  : `<p class="mb-2 fw-bold" style="color:#0077B6;font-size:1.7rem">${parseFloat(paquete.precio).toFixed(0)}€</p>`

}
       <p class="card-fecha small mb-0">
       <i class="bi bi-calendar3"></i>
        ${paquete.fecha_salida} - ${paquete.fecha_regreso}
       </p>
        </div>
          </a>
        </div>
      `;
    });

    contenedor.querySelectorAll('.card').forEach((card) => {
      card.addEventListener('click', (event) => {
        event.preventDefault();
        card.classList.remove('card-rebote');
        void card.offsetWidth;
        card.classList.add('card-rebote');

        setTimeout(() => {
          window.location.href = card.href;
        }, 220);
      });
    });

  } catch (error) {
    contenedor.innerHTML = `
      <div class="col-12 text-danger">Error cargando paquetes</div>
    `;
    console.error(error);
  }
}

document.addEventListener('DOMContentLoaded', cargarPaquetes);
