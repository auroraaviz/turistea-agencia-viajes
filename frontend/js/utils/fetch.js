/*
=========================================
CAPA DE COMUNICACIÓN API
-----------------------------------------
Responsabilidad:
- Centralizar llamadas fetch
- Añadir BASE automáticamente
- Controlar errores HTTP
- Parsear respuestas JSON

Evita repetir fetch por proyecto.
=========================================
*/


import { BASE } from "../config.js";

export async function obtener(url) {
  try {
    const respuesta = await fetch(BASE + url);

    if (!respuesta.ok) {
      throw new Error("Error HTTP: " + respuesta.status);
    }

    return await respuesta.json();
  } catch (error) {
    console.log("Error al cargar datos", error);
    return null;
  }
}

export async function crear(url, datos) {
  try {
    const respuesta = await fetch(BASE + url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    });

    if (!respuesta.ok) {
      throw new Error("Error HTTP: " + respuesta.status);
    }

    return await respuesta.json();
  } catch (error) {
    console.log("Error al enviar datos", error);
    return null;
  }
}
