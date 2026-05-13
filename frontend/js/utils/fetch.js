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
    const respuesta = await fetch(BASE + url, {
      credentials: "include",
    });

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
    const opciones = {
      method: "POST",
      body: datos instanceof FormData ? datos : JSON.stringify(datos),
      credentials: "include",
    };

    if (!(datos instanceof FormData)) {
      opciones.headers = { "Content-Type": "application/json" };
    }

    const respuesta = await fetch(BASE + url, {
      ...opciones,
    });

    if (!respuesta.ok) {
      throw new Error("Error HTTP: " + respuesta.status);
    }

    const texto = await respuesta.text();
    return texto;
  } catch (error) {
    console.log("Error al enviar datos", error);
    return null;
  }
}
