# Deploy Script for Inlakech Landing 5.0
Write-Host "Iniciando despliegue limpio..."
if (Test-Path .git) {
    Write-Host "Limpiando configuración git antigua..."
    Remove-Item -Recurse -Force .git -ErrorAction SilentlyContinue
}
Write-Host "Inicializando repositorio..."
git init
git branch -M main
Write-Host "Añadiendo archivos (esto puede tardar unos segundos)..."
git add .
git commit -m "Deploy Final v5.0"
Write-Host "Conectando con GitHub..."
git remote add origin https://github.com/vladisaiworks/LANDING-2.0-INLAKECH.git
Write-Host "Subiendo archivos (Forzando sobreescritura)..."
git push -u origin +main
Write-Host "¡Despliegue completado! Activa GitHub Pages en la configuración del repositorio."
Read-Host -Prompt "Presiona Enter para salir"
