/*
=========================================
FUNCIONES AUXILIARES
-----------------------------------------
Responsabilidad:
- Construir rutas correctas de imágenes
- Devolver clases visuales Bootstrap
- Formatear textos reutilizables

Utilidades puras reutilizadas
en varios módulos.
=========================================
*/

import { BASE } from "../../config.js";


// ===========================
// IMAGEN PAQUETE
// ===========================
export function obtenerImagen(paquete) {

  if (!paquete.imagen) {
    return `${BASE}/frontend/assets/img/default.jpg`;
  }

  let ruta = paquete.imagen;

  ruta = ruta.replace(/^\.\.\//, "");
  ruta = ruta.replace(/^frontend\//, "");

  return `${BASE}/frontend/${ruta}`;
}


// ===========================
// IMAGEN HOTEL
// ===========================
export function obtenerImagenHotel(paquete) {

  if (!paquete.hotel_imagen) {
    return `${BASE}/frontend/assets/img/default.jpg`;
  }

  let ruta = paquete.hotel_imagen;

  ruta = ruta.replace(/^\.\.\//, "");
  ruta = ruta.replace(/^frontend\//, "");

  return `${BASE}/frontend/${ruta}`;
}


// ===========================
// BADGE ESTADO
// ===========================
export function badgeEstado(activo) {
  return activo == 1
    ? "bg-success"
    : "bg-secondary";
}


// ===========================
// TEXTO ESTADO
// ===========================
export function textoEstado(activo) {
  return activo == 1
    ? "Activo"
    : "Inactivo";
}