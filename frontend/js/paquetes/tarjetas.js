document.addEventListener('DOMContentLoaded', async () => {
  const contenedor = document.getElementById('contenedor-tarjetas');

  try {
    const respuesta = await fetch('/turistea/JR_M26_AgenciaViajes/api/paquetes/get.php');
    const paquetes = await respuesta.json();

    contenedor.innerHTML = '';

    paquetes.forEach((paquete) => {
      contenedor.innerHTML += `

        <div class="col-12 col-md-6 col-lg-3">

          <div 
            class="card h-100 shadow-sm"
            data-destino="${paquete.destino}"
            data-fecha-inicio="${paquete.fecha_salida}"
            data-fecha-fin="${paquete.fecha_regreso}"
          >

            <div class="ratio ratio-16x9">
              <img 
                src="./frontend/${paquete.imagen}"
                class="card-img-top object-fit-cover"
                alt="${paquete.titulo}"
              >
            </div>

            <div class="card-body">

              <h5 class="card-title fw-bold mb-1">
                ${paquete.titulo}
              </h5>

              <p class="card-text text-muted small mb-2">
                ${paquete.descripcion}
              </p>

              <p class="small mb-2">
                <i class="bi bi-geo-alt"></i>
                ${paquete.destino}
              </p>

              <p class="card-fecha small mb-0">
                <i class="bi bi-calendar3"></i>
                ${paquete.fecha_salida} - ${paquete.fecha_regreso}
              </p>

            </div>

            <div class="p-3 pt-0">
              <a 
                href="./frontend/pages/detalle.html?id=${paquete.id}" 
                class="btn btn-primary w-100 rounded-pill"
              >
                Ver viaje
              </a>
            </div>

          </div>

        </div>

      `;
    });

  } catch (error) {
    contenedor.innerHTML = `
      <div class="col-12 text-danger">
        Error cargando paquetes
      </div>
    `;

    console.error(error);
  }
});