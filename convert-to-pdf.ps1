$chromePath = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$inputDir = ".\pdfs\blogs"
$htmlFiles = Get-ChildItem -Path $inputDir -Filter "*.html"

Write-Host "🔄 Convirtiendo $($htmlFiles.Count) archivos HTML a PDF..." -ForegroundColor Cyan
Write-Host ""

foreach ($file in $htmlFiles) {
    $htmlPath = $file.FullName
    $pdfPath = $htmlPath -replace '\.html$', '.pdf'
    $fileUrl = "file:///$($htmlPath -replace '\\', '/')"

    Write-Host "📄 Procesando: $($file.Name)" -ForegroundColor Yellow

    & $chromePath --headless=new `
        --disable-gpu `
        --print-to-pdf="$pdfPath" `
        --no-pdf-header-footer `
        --print-to-pdf-no-header `
        $fileUrl 2>$null

    if (Test-Path $pdfPath) {
        $size = [math]::Round((Get-Item $pdfPath).Length / 1KB, 2)
        Write-Host "   ✅ Generado: $($file.BaseName).pdf ($size KB)" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Error al generar PDF" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "🎉 Proceso completado!" -ForegroundColor Green
Write-Host "📁 Los PDFs están en: $((Resolve-Path $inputDir).Path)" -ForegroundColor Cyan
