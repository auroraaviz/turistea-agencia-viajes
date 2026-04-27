/*
=========================================
LÓGICA DE FILTRADO
-----------------------------------------
Responsabilidad:
- Leer filtros introducidos por usuario
- Filtrar paquetes por:
    precio
    estado
    destino
- Devolver nueva colección filtrada

No modifica datos originales.
=========================================
*/

export function leerFiltros() {
  return {
    min:
      parseFloat(
        document.getElementById("filtroPrecioMin")?.value
      ) || 0,

    max:
      parseFloat(
        document.getElementById("filtroPrecioMax")?.value
      ) || 999999,

    estado:
      document.getElementById("filtroEstado")?.value || "",

    destino:
      document.getElementById("filtroDestino")?.value || ""
  };
}

export function aplicarFiltros(paquetes, filtros) {
  return paquetes.filter((p) => {
    const precio = parseFloat(p.precio);

    return (
      precio >= filtros.min &&
      precio <= filtros.max &&
      (filtros.estado === "" ||
        String(p.activo) === filtros.estado) &&
      (filtros.destino === "" ||
        p.destino === filtros.destino)
    );
  });
}