# Deploy Script for Inlakech Landing 5.0
Write-Host "Iniciando despliegue seguro..."

# AUTOMATIC INDEX SYNC: Copy index2.html to index.html
Write-Host "Sincronizando index2.html -> index.html..."
Copy-Item -Path ".\index2.html" -Destination ".\index.html" -Force
Write-Host "¡Sincronización completada! index.html ahora es idéntico a index2.html."

if (Test-Path .git) {
    Write-Host "Limpiando configuración git antigua..."
    Remove-Item -Recurse -Force .git -ErrorAction SilentlyContinue
}
Write-Host "Inicializando repositorio..."
git init
git branch -M main
Write-Host "Añadiendo archivos (esto puede tardar unos segundos)..."
git add .
git commit -m "Deploy Final v5.0 (Auto-sync from index2)"
Write-Host "Conectando con GitHub..."
git remote add origin https://github.com/vladisaiworks/LANDING-2.0-INLAKECH.git
Write-Host "Subiendo archivos (Forzando sobreescritura)..."
git push -u origin +main
Write-Host "¡Despliegue completado! Tu index.html en GitHub es ahora la última versión de tu index2.html."
Read-Host -Prompt "Presiona Enter para salir"
