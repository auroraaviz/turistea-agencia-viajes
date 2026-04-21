// =====================================================
// CONFIGURACIÓN DE RUTAS - TURISTEA
// =====================================================
// BASE se detecta automáticamente buscando dónde está
// la carpeta /frontend/ en la URL actual.
//
// Ejemplos de cómo funciona:
//   localhost/index.html               → BASE = ""
//   localhost/turistea/index.html       → BASE = "/turistea"
//   localhost/JR_M26/turistea/index.html → BASE = "/JR_M26/turistea"
//
// Si la detección automática falla, descomenta y ajusta:
// export const BASE = "/tu-ruta-aqui";
// =====================================================

function detectarBase() {
  const ruta = window.location.pathname;

  // Si estamos dentro de /frontend/pages/, la base es 2 niveles arriba
  const idxFrontend = ruta.indexOf("/frontend/");
  if (idxFrontend !== -1) {
    return ruta.substring(0, idxFrontend);
  }

  // Si estamos en la raíz del proyecto (index.html o /)
  // Quitar el archivo del final para obtener el directorio
  const base = ruta.replace(/\/[^/]*\.html$/, "").replace(/\/$/, "");
  return base;
}

export const BASE = detectarBase();
