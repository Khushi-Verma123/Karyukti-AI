@echo off
cd /d "%~dp0"
echo Starting Karyukti AI Platform...
powershell -ExecutionPolicy Bypass -File "%~dp0start.ps1"
pause
