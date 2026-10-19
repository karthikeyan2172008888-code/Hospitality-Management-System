#!/bin/bash
# ==============================================================================
# Hospitality Management System — Localhost Launcher Script
# ==============================================================================

echo "======================================================================"
echo "🏨 Hospitality Management System — Executive Portal"
echo "======================================================================"
echo ""

PROFILE="mysql"

if [ "$1" == "--demo" ] || [ "$1" == "--h2" ]; then
    PROFILE="h2"
    echo "💡 Running in Zero-Setup Demo Mode (Embedded in-memory H2 with seed data)"
else
    echo "💡 Running in MySQL Mode (Targeting localhost:3306/hospitality_management)"
    echo "   (To run with in-memory zero-configuration DB, use: ./run.sh --h2)"
fi
echo ""

if [ -f "./HospitalityManagementSystem.jar" ]; then
    JAR_PATH="./HospitalityManagementSystem.jar"
elif [ -f "./backend/target/HospitalityManagementSystem.jar" ]; then
    JAR_PATH="./backend/target/HospitalityManagementSystem.jar"
else
    echo "⚠️  Pre-built JAR not found. Building project with Maven..."
    cd backend && ./mvnw clean package -DskipTests && cd ..
    JAR_PATH="./backend/target/HospitalityManagementSystem.jar"
fi

echo "🚀 Starting Full-Stack Application on http://localhost:8080 ..."
echo "👉 Web Portal:    http://localhost:8080"
echo "👉 Swagger Docs:  http://localhost:8080/swagger-ui.html"
echo "👉 REST API Root: http://localhost:8080/api"
echo ""
echo "Press Ctrl+C to stop the server."
echo "======================================================================"

java -jar "$JAR_PATH" --spring.profiles.active="$PROFILE"
