# Rain Dashboard - Quick Start Script
# Run this script from the project root directory

Write-Host "🌧️  Rain Dashboard - Starting All Services" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Check if Python is installed
try {
    $pythonVersion = python --version 2>&1
    Write-Host "✓ Python found: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Python not found! Please install Python 3.8+" -ForegroundColor Red
    exit 1
}

# Check if Node.js is installed
try {
    $nodeVersion = node --version 2>&1
    Write-Host "✓ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js not found! Please install Node.js 14+" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📋 Setup Checklist:" -ForegroundColor Yellow
Write-Host "  1. ESP32 connected via USB? (Check Device Manager for COM port)"
Write-Host "  2. Arduino sketch uploaded? (esp32_simple_dht11.ino)"
Write-Host "  3. COM port configured? (Check backend/config.py)"
Write-Host ""

$continue = Read-Host "Continue? (Y/N)"
if ($continue -ne "Y" -and $continue -ne "y") {
    Write-Host "Exiting..." -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "🚀 Starting Flask Backend..." -ForegroundColor Cyan

# Start Flask in a new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; python app.py"

Write-Host "✓ Flask backend started in new window" -ForegroundColor Green
Write-Host "   Backend URL: http://localhost:5000" -ForegroundColor Gray

Start-Sleep -Seconds 3

Write-Host ""
Write-Host "🎨 Starting React Frontend..." -ForegroundColor Cyan

# Check if node_modules exists
if (-not (Test-Path "frontend/node_modules")) {
    Write-Host "📦 Installing npm packages (first time only)..." -ForegroundColor Yellow
    cd frontend
    npm install
    cd ..
}

# Start React in a new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm start"

Write-Host "✓ React frontend started in new window" -ForegroundColor Green
Write-Host "   Dashboard URL: http://localhost:3000" -ForegroundColor Gray

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "✅ All services started successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Dashboard should open automatically in your browser" -ForegroundColor Cyan
Write-Host "   If not, open: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "🛑 To stop services:" -ForegroundColor Yellow
Write-Host "   Close the Flask and React terminal windows" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press any key to exit this window..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
