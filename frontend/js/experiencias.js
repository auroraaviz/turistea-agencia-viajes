/* ── Footer año ── */
document.getElementById('footer-year').textContent = new Date().getFullYear();

/*CARGAR EXPERIENCIAS DESDE BD*/
async function cargarExperiencias() {
  try {
    const res  = await fetch('../../api/comentarios/get.php');
    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0) return;

    pintarDestacada(data[0]);

    const grid = document.getElementById('gridExperiencias');
    grid.innerHTML = '';
    data.slice(1).forEach(c => {
      grid.insertAdjacentHTML('beforeend', tarjetaHTML(c));
    });

  } catch (e) {
    console.error('Error cargando experiencias:', e);
  }
}

function iniciales(nombre) {
  return nombre?.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2) ?? '??';
}

function estrellas(n) {
  return '★'.repeat(n) + '☆'.repeat(5 - n);
}

function fechaFormateada(ts) {
  const d = new Date(ts);
  return d.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
}

function pintarDestacada(c) {
  document.querySelector('.card-featured-body .review-text').textContent  = `"${c.comentario}"`;
  document.querySelector('.card-featured-body .user-name').textContent    = c.autor_nombre;
  document.querySelector('.card-featured-body .user-pkg').textContent     = c.titulo_viaje;
  document.querySelector('.card-featured-body .stars-yellow').textContent = estrellas(c.valoracion_viaje);
  document.querySelector('.card-featured-body .date-muted').innerHTML     =
    `<i class="bi bi-calendar3 me-1"></i>${fechaFormateada(c.creado_at)}`;
  document.querySelector('.card-featured-body .avatar-circle').textContent = iniciales(c.autor_nombre);

 const imgDestacada = document.getElementById('destacada-img');
  if (imgDestacada && (c.foto_url || c.imagen_paquete)) {
    imgDestacada.src = c.foto_url || c.imagen_paquete;
  }

}

function tarjetaHTML(c) {
  return `
    <div class="col-6 col-md-3">
      <div class="card-exp">
        <div class="card-exp-img">
           ${c.foto_url
            ? `<img src="${c.foto_url}" alt="${c.titulo_viaje}" />`
            : c.imagen_paquete
              ? `<img src="${c.imagen_paquete}" alt="${c.titulo_viaje}" />`
              : `<div style="background:linear-gradient(135deg,var(--navy),var(--cyan));width:100%;height:100%;position:absolute;inset:0"></div>`}
          <div class="overlay"></div>
          <div class="dest-tag"><i class="bi bi-geo-alt-fill"></i> ${c.titulo_viaje}</div>
        </div>
        <div class="card-exp-body">
          <div class="d-flex align-items-center gap-2 mb-2">
            <div class="avatar-circle">${iniciales(c.autor_nombre)}</div>
            <div>
              <p class="user-name">${c.autor_nombre}</p>
            </div>
          </div>
          <div class="stars-yellow mb-2">${estrellas(c.valoracion_viaje)}</div>
          <p class="card-review">"${c.comentario}"</p>
          <div class="d-flex justify-content-end mt-2">
            <span class="date-muted">${fechaFormateada(c.creado_at)}</span>
          </div>
        </div>
      </div>
    </div>`;
}

cargarExperiencias();

/*ESTRELLAS INTERACTIVAS — VIAJE*/
const starBtns = document.querySelectorAll('#starRating .star-btn');
let valorSeleccionado = 0;

starBtns.forEach(btn => {
  btn.addEventListener('mouseenter', () => {
    const v = +btn.dataset.val;
    starBtns.forEach(b => b.classList.toggle('activa', +b.dataset.val <= v));
  });
  btn.addEventListener('mouseleave', () => {
    starBtns.forEach(b => b.classList.toggle('activa', +b.dataset.val <= valorSeleccionado));
  });
  btn.addEventListener('click', () => {
    valorSeleccionado = +btn.dataset.val;
    starBtns.forEach(b => b.classList.toggle('activa', +b.dataset.val <= valorSeleccionado));
  });
});

/*ESTRELLAS INTERACTIVAS — COMPAÑÍA*/
const starBtnsCompania = document.querySelectorAll('#starRatingCompania .star-btn');
let valorCompania = 0;

starBtnsCompania.forEach(btn => {
  btn.addEventListener('mouseenter', () => {
    const v = +btn.dataset.val;
    starBtnsCompania.forEach(b => b.classList.toggle('activa', +b.dataset.val <= v));
  });
  btn.addEventListener('mouseleave', () => {
    starBtnsCompania.forEach(b => b.classList.toggle('activa', +b.dataset.val <= valorCompania));
  });
  btn.addEventListener('click', () => {
    valorCompania = +btn.dataset.val;
    starBtnsCompania.forEach(b => b.classList.toggle('activa', +b.dataset.val <= valorCompania));
  });
});

/*DROPZONE FOTO*/
const dropzone  = document.getElementById('dropzonePub');
const fileInput = document.getElementById('fileInputPub');

dropzone.addEventListener('click', () => fileInput.click());
dropzone.addEventListener('dragover', e => {
  e.preventDefault();
  dropzone.style.background = '#d0eef8';
});
dropzone.addEventListener('dragleave', () => {
  dropzone.style.background = '';
});
dropzone.addEventListener('drop', e => {
  e.preventDefault();
  dropzone.style.background = '';
  const file = e.dataTransfer.files[0];
  if (file) mostrarArchivo(file.name);
});
fileInput.addEventListener('change', () => {
  if (fileInput.files[0]) mostrarArchivo(fileInput.files[0].name);
});

function mostrarArchivo(nombre) {
  dropzone.innerHTML = `
    <i class="bi bi-check-circle-fill" style="font-size:2rem;color:var(--cyan);display:block;margin-bottom:6px"></i>
    <p style="color:var(--navy);font-weight:700;margin:0">${nombre}</p>`;
}

/*PUBLICAR EXPERIENCIA*/
document.querySelector('#modalPublicar .btn-primary').addEventListener('click', async () => {
  const paquete_id   = document.getElementById('selectPaquete').value;
  const comentario   = document.querySelector('#modalPublicar textarea').value.trim();
  const titulo_viaje = comentario.split('\n')[0] || 'Mi experiencia';

  if (!paquete_id)        return alert('Selecciona un paquete');
  if (!valorSeleccionado) return alert('Añade una valoración del viaje');
  if (!valorCompania)     return alert('Añade una valoración de Turistea');
  if (!comentario)        return alert('Escribe tu experiencia');

   const formData = new FormData();
  formData.append('paquete_id', paquete_id);
  formData.append('titulo_viaje', titulo_viaje);
  formData.append('comentario', comentario);
  formData.append('valoracion_viaje', valorSeleccionado);
  formData.append('valoracion_compania', valorCompania);
  if (fileInput.files[0]) {
    formData.append('foto', fileInput.files[0]);
  }

  const res = await fetch('../../api/comentarios/create.php', {
    method: 'POST',
    body: formData
  });

  const data = await res.json();

  if (data.ok) {
    bootstrap.Modal.getInstance(document.getElementById('modalPublicar')).hide();
    cargarExperiencias();
  } else {
    alert(data.mensaje);
  }
});

/*SCROLL TOP*/
const btnArriba = document.getElementById('btn-volver-arriba-exp');
window.addEventListener('scroll', () => {
  btnArriba.classList.toggle('d-none', window.scrollY < 300);
});