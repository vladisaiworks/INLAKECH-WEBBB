@echo off
echo ==========================================
echo       INLAKECH WEB DEPLOYER v2.0
echo ==========================================
echo.
echo Repo: https://github.com/vladisaiworks/INLAKECH-WEBBB.git
echo.
echo 1. Limpiando configuracion antigua...
rmdir /s /q .git 2>nul
echo.
echo 2. Inicializando repositorio limpio...
git init
git branch -M main
echo.
echo 3. Preparando archivos...
git add .
git commit -m "Deploy Final v5.0 to WEBBB"
echo.
echo 4. Conectando con GitHub...
git remote add origin https://github.com/vladisaiworks/INLAKECH-WEBBB.git
echo.
echo 5. SUBIENDO ARCHIVOS (Si aparece una ventana de GitHub, inicia sesion)...
git push -u origin main --force
echo.
echo ==========================================
echo      !SUBIDA COMPLETADA CON EXITO!
echo ==========================================
echo.
echo Pasos finales:
echo 1. Ve a tu repositorio INLAKECH-WEBBB en GitHub.
echo 2. Entra en Settings -> Pages.
echo 3. En 'Branch', selecciona 'main' y guarda.
echo 4. Espera a que aparezca tu enlace.
echo.
pause
