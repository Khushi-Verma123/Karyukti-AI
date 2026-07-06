# ===================================================
# Karyukti AI - Production Startup Script
# ===================================================
# Run this script to start the app in production mode
# The app will be available at: http://localhost:3000
# ===================================================

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  Karyukti AI - Starting Production App" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Build the backend
Write-Host "[1/3] Building backend..." -ForegroundColor Yellow
Set-Location -Path "$PSScriptRoot\backend"
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Backend build FAILED." -ForegroundColor Red
    exit 1
}
Write-Host "Backend build complete." -ForegroundColor Green

# Step 2: Build the frontend
Write-Host "[2/3] Building frontend..." -ForegroundColor Yellow
Set-Location -Path "$PSScriptRoot\frontend"
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Frontend build FAILED." -ForegroundColor Red
    exit 1
}
Write-Host "Frontend build complete." -ForegroundColor Green

# Step 3: Launch both servers
Write-Host "[3/3] Launching servers..." -ForegroundColor Yellow
Write-Host ""

# Start backend in background
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$PSScriptRoot\backend'; Write-Host 'BACKEND SERVER' -ForegroundColor Cyan; node dist/index.js"

# Give backend a moment to start
Start-Sleep -Seconds 2

# Start frontend preview in background
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$PSScriptRoot\frontend'; Write-Host 'FRONTEND SERVER' -ForegroundColor Cyan; npx vite preview --host 0.0.0.0 --port 3000"

Write-Host ""
Write-Host "=========================================" -ForegroundColor Green
Write-Host "  App is running!" -ForegroundColor Green
Write-Host "  Open: http://localhost:3000" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""
