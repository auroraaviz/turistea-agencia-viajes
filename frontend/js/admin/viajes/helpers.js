import { BASE } from '../../config.js';

// Devuelve la ruta correcta de la imagen del paquete
export function obtenerImagen(paquete) {
  return paquete.imagen
    ? `${BASE}/frontend/${paquete.imagen.replace(/^\.\.\//, '')}`
    : `${BASE}/frontend/assets/img/default.jpg`;
}

//Devuelve la ruta correcta para la imagen del hotel
export function obtenerImagenHotel(paquete) {
  return paquete.hotel_imagen
    ? `${BASE}/frontend/${paquete.hotel_imagen.replace(/^\.\.\//, '')}`
    : `${BASE}/frontend/assets/img/default.jpg`;
}

//Devuelve una clase Bootstrap según su estado
export function badgeEstado(activo) {
  return activo == 1 ? 'bg-success' : 'bg-secondary';
}
//Devuelte el texto que se mostrará
export function textoEstado(activo) {
  return activo == 1 ? 'Activo' : 'Inactivo';
}
