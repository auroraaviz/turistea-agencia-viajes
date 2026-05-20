 /* ── Footer año ── */
      document.getElementById('footer-year').textContent = new Date().getFullYear();
 
      /* ── Estrellas interactivas del modal ── */
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

        /* ── Dropzone foto ── */
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
 
      /* ── Scroll top ── */
      const btnArriba = document.getElementById('btn-volver-arriba-exp');
      window.addEventListener('scroll', () => {
        btnArriba.classList.toggle('d-none', window.scrollY < 300);
      });

 