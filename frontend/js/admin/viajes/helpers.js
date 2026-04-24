import {BASE} from "../../config.js"


// Devuelve la ruta correcta de la imagen del paquete
export function obtenerImagen(paquete){
    return paquete.imagen
 ? `${BASE}/frontend/${paquete.imagen.replace(/^\.\.\//, "")}`
 : `${BASE}/frontend/assets/img/default.jpg`;   
}

//Devuelve una clase Bootstrap según su estado
export function badgeEstado(activo){
    return activo == 1
    ? "bg-success"
    : "bg-secondary";
}
//Devuelte el texto que se mostrará
export function textoEstado(activo){
    return activo == 1
    ? "Activo"
    : "Inactivo";
}