document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get("id"));

  const loading = document.getElementById("loading");
  const error = document.getElementById("error");
  const detalle = document.getElementById("detalle");

  if (!id) {
    loading.classList.add("d-none");
    error.classList.remove("d-none");
    return;
  }

  fetch("/api/paquetes/mock.json")
    .then((res) => res.json())
    .then((json) => {
      loading.classList.add("d-none");

      if (!json.ok) {
        error.classList.remove("d-none");
        return;
      }

      const p = json.data.find((paq) => paq.id === id);

      if (!p) {
        error.classList.remove("d-none");
        return;
      }

      // Titulo de la pagina
      document.title = `${p.titulo} - Turistea`;

      // Titulo y destino
      document.getElementById("paquete-titulo").textContent = p.titulo;
      document.getElementById("paquete-destino").querySelector("span").textContent = p.destino;

      // Imagen principal
      const img = document.getElementById("paquete-imagen");
      img.src = p.imagen || "../assets/img/detalle.jpg";
      img.alt = p.titulo;

      // Info corta (hotel + regimen + fechas)
      const infoCorta = `${p.hotel_nombre} ${"★".repeat(p.hotel_estrellas || 0)} · ${p.hotel_regimen}. Fechas: ${p.fecha_salida} al ${p.fecha_regreso}`;
      document.getElementById("paquete-info-corta").textContent = infoCorta;

      // Precio
      const precio = parseFloat(p.precio);
      const descuento = parseFloat(p.descuento) || 0;
      if (descuento > 0) {
        const precioFinal = (precio - (precio * descuento) / 100).toFixed(2);
        document.getElementById("paquete-precio").innerHTML =
          `Desde <del class="text-muted">${precio.toFixed(2)}&euro;</del> ${precioFinal}&euro; pp`;
      } else {
        document.getElementById("paquete-precio").textContent = `Desde ${precio.toFixed(2)}\u20AC pp`;
      }

      // Descripcion
      document.getElementById("paquete-descripcion").textContent = p.descripcion;

      // Detalles extra (plazas + nuevos campos)
      let extras = `Plazas disponibles: ${p.plazas_disponibles} de ${p.plazas_totales}.`;
      if (p.salida_desde) {
        extras += ` Salida desde: ${p.salida_desde}.`;
      }
      if (p.vuelo_incluido) {
        extras += ` Vuelo incluido.`;
      }
      if (p.cerca_playa) {
        extras += ` Cerca de la playa.`;
      }
      extras += ` Reserva ahora y asegura tu plaza en esta experiencia.`;
      document.getElementById("paquete-detalles-extra").textContent = extras;

      // Badges (vuelo, playa, salida)
      const badgesContainer = document.getElementById("paquete-badges");
      if (badgesContainer) {
        if (p.vuelo_incluido) {
          badgesContainer.innerHTML += `<span class="badge bg-info me-2"><i class="bi bi-airplane"></i> Vuelo incluido</span>`;
        }
        if (p.cerca_playa) {
          badgesContainer.innerHTML += `<span class="badge bg-success me-2"><i class="bi bi-water"></i> Cerca de la playa</span>`;
        }
        if (p.salida_desde) {
          badgesContainer.innerHTML += `<span class="badge bg-secondary me-2"><i class="bi bi-geo"></i> Salida: ${p.salida_desde}</span>`;
        }
      }

      // Favorito toggle
      const btnFav = document.getElementById("btn-favorito");
      btnFav.addEventListener("click", () => {
        const icon = btnFav.querySelector("i");
        icon.classList.toggle("bi-heart");
        icon.classList.toggle("bi-heart-fill");
      });

      // Mostrar detalle
      detalle.classList.remove("d-none");
    })
    .catch(() => {
      loading.classList.add("d-none");
      error.classList.remove("d-none");
    });
});
