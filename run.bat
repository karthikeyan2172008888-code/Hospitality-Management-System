@echo off
REM ==============================================================================
REM Hospitality Management System — Windows Launcher Script
REM ==============================================================================

echo ======================================================================
echo  Hospitality Management System - Executive Portal
echo ======================================================================
echo.

set PROFILE=mysql

if "%1"=="--demo" set PROFILE=h2
if "%1"=="--h2" set PROFILE=h2

if "%PROFILE%"=="h2" (
    echo [INFO] Running in Zero-Setup Demo Mode (Embedded H2 with seed data)
) else (
    echo [INFO] Running in MySQL Mode (Targeting localhost:3306/hospitality_management)
    echo        (To run without MySQL, pass: run.bat --h2)
)
echo.

set JAR_PATH=HospitalityManagementSystem.jar
if not exist "%JAR_PATH%" (
    if exist "backend\target\HospitalityManagementSystem.jar" (
        set JAR_PATH=backend\target\HospitalityManagementSystem.jar
    ) else (
        echo [INFO] Building runnable JAR with Maven...
        cd backend
        call mvnw.cmd clean package -DskipTests
        cd ..
        set JAR_PATH=backend\target\HospitalityManagementSystem.jar
    )
)

echo [INFO] Starting Application on http://localhost:8080 ...
echo - Web Dashboard:  http://localhost:8080
echo - Swagger Docs:   http://localhost:8080/swagger-ui.html
echo - REST API:       http://localhost:8080/api
echo.
echo Press Ctrl+C to stop.
echo ======================================================================

java -jar "%JAR_PATH%" --spring.profiles.active=%PROFILE%
pause
