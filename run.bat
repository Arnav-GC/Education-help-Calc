@echo off
title EduCalc Pro - Launcher
cls
echo ========================================================
echo          EduCalc Pro - Marks & Grade Calculator         
echo ========================================================
echo.
echo Choose how you would like to run the application:
echo.
echo  [1] Start Web Application (Python Server + Modern Web UI)
echo  [2] Run Interactive Python CLI
echo  [3] Run Unit Tests
echo  [4] Exit
echo.
set /p choice="Enter your choice (1-4): "

if "%choice%"=="1" (
    echo.
    echo Starting Python Server on http://localhost:5000 ...
    start http://localhost:5000
    python app.py
) else if "%choice%"=="2" (
    echo.
    python src\python\cli.py
    pause
) else if "%choice%"=="3" (
    echo.
    python -m unittest tests\test_calculator.py
    pause
) else (
    exit
)
