@echo off
echo ========================================
echo    Creating Chiya Shop Database
echo ========================================
echo.

echo Looking for PostgreSQL installation...

:: Common PostgreSQL installation paths
set "PSQL_PATHS=C:\Program Files\PostgreSQL\17\bin;C:\Program Files\PostgreSQL\16\bin;C:\Program Files\PostgreSQL\15\bin;C:\Program Files\PostgreSQL\14\bin;C:\Program Files\PostgreSQL\13\bin;C:\Program Files\PostgreSQL\12\bin"

set PSQL_FOUND=0
for %%p in ("%PSQL_PATHS:;=" "%") do (
    if exist "%%~p\psql.exe" (
        set "PSQL_PATH=%%~p"
        set PSQL_FOUND=1
        goto :found
    )
)

:found
if %PSQL_FOUND%==0 (
    echo ERROR: PostgreSQL not found in common installation paths.
    echo Please install PostgreSQL or check your installation.
    echo Expected locations:
    echo - C:\Program Files\PostgreSQL\16\bin
    echo - C:\Program Files\PostgreSQL\15\bin
    echo - C:\Program Files\PostgreSQL\14\bin
    pause
    exit /b 1
)

echo Found PostgreSQL at: %PSQL_PATH%
echo.

echo Creating database 'chiya_shop_db'...
echo Please enter your PostgreSQL password when prompted.
echo.

set PGPASSWORD=admin123
"%PSQL_PATH%\psql.exe" -h localhost -p 5432 -U postgres -c "CREATE DATABASE chiya_shop_db;"

if %errorlevel% neq 0 (
    echo.
    echo Database creation may have failed or database already exists.
    echo Please check your PostgreSQL password and try again.
    echo.
    echo If the database already exists, you can continue.
    pause
) else (
    echo.
    echo ✅ Database 'chiya_shop_db' created successfully!
)

echo.
echo ========================================
echo    Database Setup Complete!
echo ========================================
echo.
echo Database: chiya_shop_db
echo Host: localhost:5432
echo User: postgres
echo Password: admin123
echo.
echo Next steps:
echo 1. Run: npm run dev
echo 2. The app will create tables automatically
echo 3. Default users will be created
echo.
pause
