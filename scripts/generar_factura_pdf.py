"""
Script para generar un PDF de factura/confirmación de reserva de Turistea.
Usa datos mock basados en el esquema real de la BD.
Ejecutar: python3 scripts/generar_factura_pdf.py
"""

from fpdf import FPDF
from datetime import datetime, timedelta
import os

# ── Datos mock basados en el esquema real de la BD ──────────────────────────

usuario = {
    "id": 3,
    "nombre": "Pedro Manuel",
    "apellidos": "Romero Justiciano",
    "email": "justiciano@gradenower.es",
    "telefono": "+34 628628628",
}

paquete = {
    "id": 1,
    "titulo": "Aventura en los Pirineos",
    "descripcion": (
        "Descubre los paisajes mas impresionantes del Pirineo aragones. "
        "Rutas de senderismo, pueblos medievales y gastronomia local "
        "en un viaje inolvidable de 5 dias."
    ),
    "destino": "Huesca, Aragon",
    "hotel_nombre": "Hotel Monte Perdido",
    "hotel_estrellas": 4,
    "hotel_regimen": "Media pension",
    "hotel_detalles": "WiFi gratis, piscina exterior, desayuno buffet y parking privado.",
    "fecha_salida": "2026-06-15",
    "fecha_regreso": "2026-06-20",
    "precio": 549.00,
    "descuento": 10.00,
    "vuelo_incluido": True,
    "salida_desde": "Barcelona",
    "cerca_playa": False,
    "categoria": "vacaciones",
}

reserva = {
    "id": 1042,
    "num_viajeros": 2,
    "estado": "CONFIRMADA",
    "fecha_reserva": "2026-05-08 10:30:00",
}

pago = {
    "id": 501,
    "metodo": "TARJETA",
    "estado": "PAGADO",
    "referencia_externa": "TUR-2026-1042-XK9F",
    "fecha_pago": "2026-05-08 10:31:12",
}

viajeros = [
    {
        "nombre": "Pedro Manuel",
        "apellidos": "Romero Justiciano",
        "dni": "12345678A",
        "fecha_nacimiento": "1990-03-15",
    },
    {
        "nombre": "Maria",
        "apellidos": "Lopez Garcia",
        "dni": "87654321B",
        "fecha_nacimiento": "1992-07-22",
    },
]

excursiones = [
    {
        "nombre": "Ruta Senderismo Monte Perdido",
        "descripcion": "Ruta guiada por el Parque Nacional de Ordesa",
        "fecha_hora": "2026-06-16 09:00",
        "precio": 35.00,
    },
    {
        "nombre": "Visita Pueblo Medieval de Ainsa",
        "descripcion": "Recorrido historico por el casco antiguo",
        "fecha_hora": "2026-06-17 11:00",
        "precio": 15.00,
    },
]


# ── Calculos ────────────────────────────────────────────────────────────────

precio_por_persona = paquete["precio"]
descuento_pct = paquete["descuento"]
precio_con_descuento = precio_por_persona * (1 - descuento_pct / 100)
num_viajeros = reserva["num_viajeros"]
subtotal_paquete = precio_con_descuento * num_viajeros
total_excursiones = sum(e["precio"] for e in excursiones) * num_viajeros
precio_total = subtotal_paquete + total_excursiones

fecha_salida = datetime.strptime(paquete["fecha_salida"], "%Y-%m-%d")
fecha_regreso = datetime.strptime(paquete["fecha_regreso"], "%Y-%m-%d")
noches = (fecha_regreso - fecha_salida).days


# ── Colores corporativos ───────────────────────────────────────────────────

TEAL = (0, 150, 136)
DARK = (50, 50, 50)
GREY = (120, 120, 120)
LIGHT_GREY = (160, 160, 160)
LIGHT_BG = (240, 248, 247)
WHITE = (255, 255, 255)


# ── Generacion del PDF ─────────────────────────────────────────────────────

class FacturaPDF(FPDF):
    def header(self):
        logo_path = os.path.join(
            os.path.dirname(__file__), "..",
            "frontend", "assets", "img", "Turistea_Logo", "logo_turistea.png"
        )
        if os.path.exists(logo_path):
            self.image(logo_path, 10, 8, 30)
        # Numero de factura arriba a la derecha
        self.set_font("Helvetica", "B", 10)
        self.set_text_color(*GREY)
        self.set_xy(140, 10)
        self.cell(60, 6, f"Factura #{reserva['id']}", 0, 1, "R")
        self.set_xy(140, 16)
        self.set_font("Helvetica", "", 9)
        self.cell(60, 6, f"Ref: {pago['referencia_externa']}", 0, 1, "R")
        self.set_xy(140, 22)
        self.cell(60, 6, f"Fecha: {pago['fecha_pago'][:10]}", 0, 1, "R")
        # Asegurar que el contenido empiece despues del logo en todas las paginas
        self.set_y(38)

    def footer(self):
        self.set_y(-25)
        self.set_draw_color(*TEAL)
        self.set_line_width(0.8)
        self.line(10, self.get_y(), 200, self.get_y())
        self.ln(4)
        self.set_font("Helvetica", "I", 8)
        self.set_text_color(*LIGHT_GREY)
        self.cell(0, 5, "Este documento sirve como comprobante de su reserva.", 0, 1, "C")
        self.cell(0, 5, "turistea@test.com | www.turistea.com", 0, 1, "C")
        self.cell(0, 5, f"(c) {datetime.now().year} Turistea - Todos los derechos reservados", 0, 1, "C")

    def seccion_titulo(self, titulo):
        self.set_font("Helvetica", "B", 13)
        self.set_text_color(*TEAL)
        self.cell(0, 10, titulo, 0, 1, "L")
        self.set_draw_color(*TEAL)
        self.set_line_width(0.5)
        self.line(10, self.get_y(), 200, self.get_y())
        self.ln(4)

    def campo(self, etiqueta, valor, ancho_etiqueta=45):
        self.set_font("Helvetica", "B", 10)
        self.set_text_color(*DARK)
        self.cell(ancho_etiqueta, 7, etiqueta, 0, 0)
        self.set_font("Helvetica", "", 10)
        self.cell(0, 7, str(valor), 0, 1)


pdf = FacturaPDF()
pdf.add_page()
pdf.set_auto_page_break(True, 30)

# ── Titulo principal ───────────────────────────────────────────────────────

pdf.set_font("Helvetica", "B", 20)
pdf.set_text_color(*TEAL)
pdf.cell(0, 12, "Confirmacion de Reserva", 0, 1, "C")

pdf.ln(2)
pdf.set_draw_color(*TEAL)
pdf.set_line_width(1)
pdf.line(10, pdf.get_y(), 200, pdf.get_y())
pdf.ln(6)

# ── Saludo ─────────────────────────────────────────────────────────────────

pdf.set_font("Helvetica", "", 11)
pdf.set_text_color(*DARK)
pdf.multi_cell(
    0, 7,
    f"Estimado/a {usuario['nombre']} {usuario['apellidos']},\n"
    "Gracias por reservar con Turistea. A continuacion encontraras "
    "los detalles de tu reserva y todo lo que incluye tu paquete."
)
pdf.ln(4)

# ── Datos del cliente ──────────────────────────────────────────────────────

pdf.seccion_titulo("Datos del cliente")
pdf.campo("Nombre:", f"{usuario['nombre']} {usuario['apellidos']}")
pdf.campo("Email:", usuario["email"])
pdf.campo("Telefono:", usuario["telefono"])
pdf.ln(4)

# ── Detalles del paquete ──────────────────────────────────────────────────

pdf.seccion_titulo("Detalles del paquete")
pdf.campo("Paquete:", paquete["titulo"])
pdf.campo("Destino:", paquete["destino"])
pdf.campo("Descripcion:", "")
pdf.set_font("Helvetica", "", 9)
pdf.set_text_color(*DARK)
pdf.multi_cell(0, 6, paquete["descripcion"])
pdf.ln(2)

pdf.campo("Fecha de salida:", paquete["fecha_salida"])
pdf.campo("Fecha de regreso:", paquete["fecha_regreso"])
pdf.campo("Noches:", str(noches))
pdf.ln(4)

# ── Vuelo ──────────────────────────────────────────────────────────────────

if paquete["vuelo_incluido"]:
    pdf.seccion_titulo("Informacion de vuelo")
    pdf.campo("Vuelo incluido:", "Si")
    pdf.campo("Salida desde:", paquete["salida_desde"])
    pdf.campo("Fecha ida:", paquete["fecha_salida"])
    pdf.campo("Fecha vuelta:", paquete["fecha_regreso"])
    pdf.ln(4)

# ── Alojamiento ────────────────────────────────────────────────────────────

pdf.seccion_titulo("Alojamiento")
estrellas = "*" * paquete["hotel_estrellas"]
pdf.campo("Hotel:", f"{paquete['hotel_nombre']} ({estrellas})")
pdf.campo("Regimen:", paquete["hotel_regimen"])
pdf.campo("Servicios:", "")
pdf.set_font("Helvetica", "", 9)
pdf.multi_cell(0, 6, paquete["hotel_detalles"])
pdf.ln(4)

# ── Excursiones incluidas ─────────────────────────────────────────────────

if excursiones:
    pdf.seccion_titulo("Excursiones incluidas")
    for i, exc in enumerate(excursiones, 1):
        pdf.set_font("Helvetica", "B", 10)
        pdf.set_text_color(*DARK)
        pdf.cell(0, 7, f"{i}. {exc['nombre']}", 0, 1)
        pdf.set_font("Helvetica", "", 9)
        pdf.set_text_color(*GREY)
        pdf.cell(0, 6, f"   {exc['descripcion']}", 0, 1)
        pdf.cell(0, 6, f"   Fecha: {exc['fecha_hora']}  |  Precio: {exc['precio']:.2f} EUR/persona", 0, 1)
        pdf.ln(2)
    pdf.ln(2)

# ── Viajeros ───────────────────────────────────────────────────────────────

pdf.seccion_titulo("Viajeros")
for i, v in enumerate(viajeros, 1):
    pdf.set_font("Helvetica", "B", 10)
    pdf.set_text_color(*DARK)
    pdf.cell(0, 7, f"Viajero {i}: {v['nombre']} {v['apellidos']}", 0, 1)
    pdf.set_font("Helvetica", "", 9)
    pdf.set_text_color(*GREY)
    pdf.cell(0, 6, f"   DNI: {v['dni']}  |  Nacimiento: {v['fecha_nacimiento']}", 0, 1)
    pdf.ln(2)
pdf.ln(2)

# ── Resumen de precio (tabla) ─────────────────────────────────────────────

pdf.seccion_titulo("Resumen economico")

# Fondo de cabecera de tabla
y_start = pdf.get_y()
pdf.set_fill_color(*TEAL)
pdf.set_text_color(*WHITE)
pdf.set_font("Helvetica", "B", 10)
pdf.cell(100, 8, "  Concepto", 0, 0, "L", fill=True)
pdf.cell(30, 8, "Ud.", 0, 0, "C", fill=True)
pdf.cell(30, 8, "Precio/ud.", 0, 0, "R", fill=True)
pdf.cell(30, 8, "Total", 0, 1, "R", fill=True)

# Fila paquete
pdf.set_fill_color(*LIGHT_BG)
pdf.set_text_color(*DARK)
pdf.set_font("Helvetica", "", 10)
pdf.cell(100, 8, f"  {paquete['titulo']}", 0, 0, "L", fill=True)
pdf.cell(30, 8, str(num_viajeros), 0, 0, "C", fill=True)
pdf.cell(30, 8, f"{precio_con_descuento:.2f} EUR", 0, 0, "R", fill=True)
pdf.cell(30, 8, f"{subtotal_paquete:.2f} EUR", 0, 1, "R", fill=True)

if descuento_pct > 0:
    pdf.set_font("Helvetica", "I", 9)
    pdf.set_text_color(*GREY)
    pdf.cell(100, 6, f"    (Precio original: {precio_por_persona:.2f} EUR - {descuento_pct:.0f}% dto.)", 0, 1)

# Filas excursiones
pdf.set_text_color(*DARK)
pdf.set_font("Helvetica", "", 10)
for exc in excursiones:
    pdf.set_fill_color(*WHITE)
    pdf.cell(100, 8, f"  Excursion: {exc['nombre']}", 0, 0, "L", fill=True)
    pdf.cell(30, 8, str(num_viajeros), 0, 0, "C", fill=True)
    pdf.cell(30, 8, f"{exc['precio']:.2f} EUR", 0, 0, "R", fill=True)
    pdf.cell(30, 8, f"{exc['precio'] * num_viajeros:.2f} EUR", 0, 1, "R", fill=True)

# Linea separadora
pdf.ln(2)
pdf.set_draw_color(*TEAL)
pdf.set_line_width(0.5)
pdf.line(10, pdf.get_y(), 200, pdf.get_y())
pdf.ln(3)

# Total
pdf.set_font("Helvetica", "B", 12)
pdf.set_text_color(*TEAL)
pdf.cell(160, 10, "TOTAL:", 0, 0, "R")
pdf.cell(30, 10, f"{precio_total:.2f} EUR", 0, 1, "R")

pdf.ln(2)

# ── Info de pago ───────────────────────────────────────────────────────────

pdf.seccion_titulo("Informacion de pago")
pdf.campo("Metodo de pago:", pago["metodo"])
pdf.campo("Estado:", pago["estado"])
pdf.campo("Referencia:", pago["referencia_externa"])
pdf.campo("Fecha de pago:", pago["fecha_pago"])
pdf.campo("Estado reserva:", reserva["estado"])
pdf.ln(6)

# ── Despedida ──────────────────────────────────────────────────────────────

pdf.set_font("Helvetica", "", 11)
pdf.set_text_color(*DARK)
pdf.multi_cell(
    0, 7,
    "Gracias por confiar en Turistea. "
    "Estamos deseando ayudarte a disfrutar de tu proxima aventura!"
)
pdf.ln(4)
pdf.set_font("Helvetica", "B", 11)
pdf.cell(0, 7, "El equipo de Turistea", 0, 1, "L")

# ── Guardar ────────────────────────────────────────────────────────────────

output_dir = os.path.join(os.path.dirname(__file__), "..", "output")
os.makedirs(output_dir, exist_ok=True)
output_path = os.path.join(output_dir, "factura_reserva_1042.pdf")
pdf.output(output_path)
print(f"PDF generado en: {os.path.abspath(output_path)}")
