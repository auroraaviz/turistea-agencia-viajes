/* global bootstrap: false */
(function () {
  'use strict'
  var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
  tooltipTriggerList.forEach(function (tooltipTriggerEl) {
    new bootstrap.Tooltip(tooltipTriggerEl)
  })

  var sidebar = document.getElementById('sidebarAdmin')
  if (!sidebar) return

  sidebar.addEventListener('click', function (event) {
    var link = event.target.closest('a')
    if (!link || window.innerWidth >= 992) return

    var offcanvas = bootstrap.Offcanvas.getInstance(sidebar)
    if (offcanvas) offcanvas.hide()
  })
})()
