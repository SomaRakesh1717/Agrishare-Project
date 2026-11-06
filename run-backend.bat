@echo off
echo Starting AgriShare Spring Boot Backend on port 8080...
cd /d "%~dp0backend"
call "apache-maven-3.9.9\bin\mvn.cmd" spring-boot:run
