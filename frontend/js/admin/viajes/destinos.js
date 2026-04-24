import { BASE } from "../../config.js";


export async function obtenerDestinos() {
  try {
    const respuesta = await fetch(
      BASE + "/api/destinos/get.php"
    );

    return await respuesta.json();

  } catch (error) {
    console.error(error);
    return [];
  }
}