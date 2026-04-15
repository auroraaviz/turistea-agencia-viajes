export async function obtener(url) {
  try {
    const respuesta = await fetch(url);

    if (!respuesta.ok) {
      throw new Error("Error HTTP: " + respuesta.status);
    }

    return await respuesta.json();
  } catch (error) {
    console.log("Error al cargar datos", error);
    return null;
  }
}