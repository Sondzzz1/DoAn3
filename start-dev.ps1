# Script chạy đồng thời Backend và Frontend
# PowerShell Script

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "  ART GALLERY - Development Mode" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Kiểm tra xem đã ở đúng thư mục chưa
if (-not (Test-Path "DoAn3_BackEnd") -or -not (Test-Path "art-gallery-react")) {
    Write-Host "ERROR: Vui long chay script tu thu muc goc cua du an!" -ForegroundColor Red
    Write-Host "Thu muc hien tai: $(Get-Location)" -ForegroundColor Yellow
    exit 1
}

Write-Host "[1/2] Dang khoi dong Backend (ASP.NET Core)..." -ForegroundColor Green
Write-Host "      URL: http://localhost:5273" -ForegroundColor Yellow
Write-Host ""

# Chạy Backend trong background
$backendJob = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd DoAn3_BackEnd/DoAn2_BackEnd; Write-Host 'BACKEND SERVER' -ForegroundColor Green; dotnet run" -PassThru

# Đợi 8 giây để backend khởi động
Start-Sleep -Seconds 8

Write-Host "[2/2] Dang khoi dong Frontend (React)..." -ForegroundColor Green
Write-Host "      URL: http://localhost:3000" -ForegroundColor Yellow
Write-Host ""

# Chạy Frontend trong background
$frontendJob = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd art-gallery-react; Write-Host 'FRONTEND SERVER' -ForegroundColor Cyan; npm start" -PassThru

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "  Servers dang chay!" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend:  http://localhost:5273" -ForegroundColor Yellow
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Yellow
Write-Host ""
Write-Host "Nhan Ctrl+C de dung tat ca servers" -ForegroundColor Red
Write-Host ""

# Giữ script chạy và lắng nghe Ctrl+C
try {
    while ($true) {
        Start-Sleep -Seconds 1
    }
}
finally {
    Write-Host ""
    Write-Host "Dang dung servers..." -ForegroundColor Yellow
    Stop-Process -Id $backendJob.Id -Force -ErrorAction SilentlyContinue
    Stop-Process -Id $frontendJob.Id -Force -ErrorAction SilentlyContinue
    Write-Host "Da dung tat ca servers!" -ForegroundColor Green
}
