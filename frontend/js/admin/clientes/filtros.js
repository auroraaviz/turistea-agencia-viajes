export function leerFiltros() {
  return {
    busqueda: document.getElementById('filtroBusqueda')?.value.trim().toLowerCase() ?? '',
    rol: document.getElementById('filtroRol')?.value ?? '',
    activo: document.getElementById('filtroActivo')?.value ?? '',
  };
}
 
export function aplicarFiltros(usuarios, filtros) {
  return usuarios.filter((u) => {

    console.log('activo del usuario:', u.activo, typeof u.activo, '| filtro:', filtros.activo, typeof filtros.activo);

    const textoUsuario = `${u.nombre} ${u.apellidos ?? ''} ${u.email}`.toLowerCase();
    const pasaBusqueda = !filtros.busqueda || textoUsuario.includes(filtros.busqueda);
    const pasaRol      = !filtros.rol    || (u.rol ?? 'usuario') === filtros.rol;
    const pasaActivo   = filtros.activo === '' || String(u.activo) === filtros.activo;
 
    return pasaBusqueda && pasaRol && pasaActivo;
  });
}
 
