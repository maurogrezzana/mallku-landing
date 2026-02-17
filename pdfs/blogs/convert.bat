@echo off
setlocal enabledelayedexpansion
echo Convirtiendo archivos HTML a PDF...
echo.

set CHROME="C:\Program Files\Google\Chrome\Application\chrome.exe"

for %%f in (*.html) do (
    echo Procesando: %%f
    %CHROME% --headless=new --disable-gpu --print-to-pdf="%%~nf.pdf" --no-pdf-header-footer "%%~ff"
    if exist "%%~nf.pdf" (
        echo   OK: %%~nf.pdf
    ) else (
        echo   ERROR: No se pudo generar %%~nf.pdf
    )
    echo.
)

echo.
echo Proceso completado!
