// Badge Bootstrap según activo (1/0)
export function badgeActivo(activo) {
  return activo == 1
    ? 'bg-success'
    : 'bg-danger';
}
 
export function textoActivo(activo) {
  return activo == 1 ? 'Activo' : 'Bloqueado';
}
 
// Badge según rol
export function badgeRol(rol) {
  switch (rol) {
    case 'admin':   return 'bg-primary';
    case 'gestor':  return 'bg-warning text-dark';
    default:        return 'bg-secondary';      // usuario
  }
}
 
export function textoRol(rol) {
  if (!rol) return 'usuario';
  return rol.charAt(0).toUpperCase() + rol.slice(1);
}
 
// Avatar con iniciales cuando no hay foto_perfil
export function avatar(usuario) {
  if (usuario.foto_perfil) {
    return `<img
      src="${usuario.foto_perfil}"
      alt="${usuario.nombre}"
      class="rounded-circle"
      style="width:38px;height:38px;object-fit:cover;"
    >`;
  }
 
  const iniciales = (
    (usuario.nombre?.[0] ?? '') +
    (usuario.apellidos?.[0] ?? '')
  ).toUpperCase();
 
  return `<div
    class="rounded-circle d-inline-flex align-items-center justify-content-center bg-info text-white fw-bold"
    style="width:38px;height:38px;font-size:.85rem;"
  >${iniciales}</div>`;
}
