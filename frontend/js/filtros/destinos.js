import { BASE } from "../config.js";

document.addEventListener("DOMContentLoaded", async () => {

    const select = document.getElementById("select-destino");

    try {

        const respuesta = await fetch(
            BASE + "/api/destinos/get.php"
        );

        const destinos = await respuesta.json();

        destinos.forEach(item => {

            select.innerHTML += `
                <option value="${item.destino}">
                    ${item.destino}
                </option>
            `;

        });

    } catch (error) {

        console.error("Error cargando destinos:", error);

    }

});