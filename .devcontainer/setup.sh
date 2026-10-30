#!/usr/bin/env bash
# Corregir permisos de .gemini generados por el bind mount de Docker (buenas prácticas de AgentToolkit)
# Se utiliza sudo -n (no interactivo) para evitar bloqueos si no hay terminal interactiva
sudo -n chown node:node /home/node/.gemini /home/node/.gemini/config 2>/dev/null || true

set -u

echo "=== Inicializando entorno Devcontainer para HasselPunk ==="

# Verificación de conectividad a Internet (Caso de falla / borde)
echo "[1/2] Verificando conectividad a internet..."
if curl -s --connect-timeout 3 https://registry.npmjs.org > /dev/null 2>&1; then
    echo "✔ Conectividad confirmada con npm registry."
    ONLINE=true
else
    echo "⚠ ADVERTENCIA: No se detectó conexión a internet o el registry de npm no responde."
    echo "  El contenedor se iniciará en modo offline sin bloquear la inicialización."
    ONLINE=false
fi

# Verificación e instalación de dependencias si package.json existe
echo "[2/2] Verificando archivos de dependencias del proyecto..."
if [ -f "package.json" ]; then
    if [ "$ONLINE" = true ]; then
        echo "Instalando dependencias con npm install..."
        npm install || {
            echo "⚠ npm install finalizó con advertencias, pero el entorno continúa activo."
        }
    else
        echo "⚠ Modo offline: Se detectó package.json pero no hay conexión; omitiendo npm install."
    fi
else
    echo "ℹ No se encontró package.json en este paso (el scaffolding de Astro se configurará en el Issue #3)."
fi

echo "=== Inicialización del Devcontainer finalizada con éxito ==="
exit 0
