#!/bin/bash
# Script para configurar y arrancar Turistea
# Uso: bash setup.sh

echo "=== Turistea - Setup ==="

# 1. Verificar que MySQL/MariaDB está corriendo
if ! mysqladmin ping -h 127.0.0.1 &>/dev/null; then
    echo ">> Arrancando MariaDB..."
    sudo service mariadb start 2>/dev/null || sudo service mysql start 2>/dev/null
    sleep 2
fi

if ! mysqladmin ping -h 127.0.0.1 &>/dev/null; then
    echo "ERROR: No se pudo conectar a MySQL/MariaDB."
    echo "Arranca MySQL manualmente: sudo service mariadb start"
    exit 1
fi

echo ">> MySQL/MariaDB activo"

# 2. Crear base de datos y usuario (con sudo para acceder como root)
echo ">> Creando base de datos 'turistea'..."
sudo mysql <<SQL
CREATE DATABASE IF NOT EXISTS turistea CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
CREATE USER IF NOT EXISTS 'turistea'@'127.0.0.1' IDENTIFIED BY 'turistea';
CREATE USER IF NOT EXISTS 'turistea'@'localhost' IDENTIFIED BY 'turistea';
GRANT ALL PRIVILEGES ON turistea.* TO 'turistea'@'127.0.0.1';
GRANT ALL PRIVILEGES ON turistea.* TO 'turistea'@'localhost';
FLUSH PRIVILEGES;
SQL

# 3. Importar esquema
echo ">> Importando esquema y datos..."
sudo mysql turistea < BD/turistea.sql 2>/dev/null

if [ $? -eq 0 ]; then
    echo ">> Base de datos importada correctamente"
else
    echo ">> La base de datos ya existia o hubo un aviso (puede ser normal)"
fi

# 4. Verificar datos
PAQUETES=$(mysql -u turistea -pturistea -h 127.0.0.1 turistea -N -e "SELECT COUNT(*) FROM paquete" 2>/dev/null)
USUARIOS=$(mysql -u turistea -pturistea -h 127.0.0.1 turistea -N -e "SELECT COUNT(*) FROM usuario" 2>/dev/null)
echo ">> Paquetes en BD: $PAQUETES | Usuarios: $USUARIOS"

# 5. Arrancar servidor PHP
echo ""
echo "=== Arrancando servidor PHP en http://localhost:8000 ==="
echo "  - Inicio:    http://localhost:8000"
echo "  - Login:     http://localhost:8000/frontend/pages/login.html"
echo "  - Registro:  http://localhost:8000/frontend/pages/register.html"
echo "  - Detalle:   http://localhost:8000/frontend/pages/detalle.html?id=1"
echo ""
echo "Pulsa Ctrl+C para parar el servidor"
echo ""

php -S localhost:8000