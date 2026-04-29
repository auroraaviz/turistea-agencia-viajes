/*
=========================================
ESTADO GLOBAL DEL MÓDULO VIAJES
-----------------------------------------
Responsabilidad:
- Guardar datos compartidos
- Lista completa de paquetes
- Lista filtrada actual
- Página activa
- Número de elementos por página
- Destinos disponibles

Pequeño store local del módulo.
=========================================
*/

export const state = {
    paquetes: [],
    destinos: [],
    listaActual: [],
    paginaActual: 1,
    porPagina: 8,
    estadoFijo: "",
    vistaCompacta: false
};
