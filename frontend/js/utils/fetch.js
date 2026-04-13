async function obtener() {
  try {
    const respuesta = await fetch('../../BD/mock.json');

    if (!respuesta.ok) {
      throw new Error('Error HTTP: ' + respuesta.status);
    }

    const data = await respuesta.json();
    return data; 

  } catch (error) {
    console.log("Error al cargar el JSON", error);
    return null;
  }
}