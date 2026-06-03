@echo off
cd /d "%~dp0"
set PORT=%~1
if "%PORT%"=="" set PORT=3001
echo Starting M.Ex.T. Sales App on http://localhost:%PORT%
"C:\Program Files\nodejs\node.exe" node_modules\next\dist\bin\next start --port %PORT%
