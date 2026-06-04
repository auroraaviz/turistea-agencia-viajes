# Turistea — Agencia de viajes online

![PHP](https://img.shields.io/badge/PHP-777BB4?style=flat&logo=php&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat&logo=mysql&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Bootstrap](https://img.shields.io/badge/Bootstrap_5-7952B3?style=flat&logo=bootstrap&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)

Aplicación web para una agencia de viajes desarrollada durante las prácticas en **Zaitec** (marzo–junio 2026). Permite explorar paquetes turísticos, realizar reservas, gestionar perfiles de usuario y administrar todo el contenido desde un panel privado.

> Proyecto de equipo — 4 desarrolladores, 11 semanas, entorno profesional real.

---

## Funcionalidades principales

**Para el usuario:**
- Exploración de paquetes turísticos con filtros por destino, fechas y categoría
- Página de detalle con información completa del viaje y alojamiento
- Sistema de reservas con inclusión de hasta 5 acompañantes
- Pasarela de pago simulada con generación de factura en PDF
- Perfil personal con historial de reservas y paquetes favoritos
- Sección de experiencias: leer y publicar reseñas con fotos

**Para el administrador:**
- Panel privado con métricas generales (reservas, usuarios, ingresos)
- CRUD completo de paquetes turísticos con subida de imágenes
- Gestión de clientes, roles y bloqueo de cuentas
- Seguimiento de reservas mediante línea de tiempo de estados
- Gestión y moderación de reseñas
- Apartado de finanzas con generación de facturas descargables

---

## Arquitectura
---

## Tecnologías utilizadas

| Área | Tecnologías |
|------|-------------|
| Frontend | HTML5, CSS3, JavaScript, Bootstrap 5 |
| Backend | PHP (API REST con endpoints JSON) |
| Base de datos | MySQL |
| Diseño | Figma |
| Control de versiones | Git, GitHub (ramas por funcionalidad) |
| Entorno local | XAMPP (Apache + MySQL) |

---

## Instalación en local

```bash
git clone https://github.com/auroraaviz/turistea-agencia-viajes.git
cd turistea-agencia-viajes
```

1. Instalar **XAMPP** y arrancar los servicios Apache y MySQL
2. Copiar la carpeta en `htdocs/turistea/`
3. Importar `turistea.sql` en phpMyAdmin con base de datos llamada `turistea`
4. Abrir en el navegador: `http://localhost/turistea/turistea/`

---

## Retos técnicos resueltos

- **Conflictos de Git en equipo:** nomenclatura por funcionalidad y rama `dev` centralizada
- **CORS y rutas PHP:** depuración con consola del navegador y mensajes en endpoints
- **Subida de imágenes:** unificación de rutas y estructura de carpetas
- **Seguridad:** datos de tarjeta almacenados con hash tras detectar la vulnerabilidad
- **Responsive:** pruebas continuas en distintos tamaños de pantalla

---

## Equipo

| Nombre | Contribución principal |
|--------|----------------------|
| Aurora Ávila Izquierdo | Diseño UI/UX y logotipo, login y registro, filtros dinámicos, página de detalle, menú dinámico por rol, panel de reservas, slider, página de experiencias, navbar unificado, modal de contacto |
| Juan Luis Ramos Soria | Página de inicio, CRUD paquetes, panel admin, pasarela de pago, reseñas, seguridad (hash tarjetas) |
| Jorge García Millán | Diagrama ER, página de detalles, URLs dinámicas, generación de PDF, panel admin backend, pasarela de pago |
| Máximo Casado Giner | Diseño Figma, desarrollo frontend, testing, despliegue en servidor
## Autora (desde este perfil)

**Aurora Ávila Izquierdo** · [GitHub](https://github.com/auroraaviz) · [LinkedIn](https://www.linkedin.com/in/aurora-avila-dev/)
