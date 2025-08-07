@echo off
echo ========================================
echo   PostgreSQL Password Tester
echo ========================================
echo.

set "PSQL_PATH=C:\Program Files\PostgreSQL\17\bin"

echo Testing connection to PostgreSQL...
echo.

echo Common passwords to test:
echo 1. postgres
echo 2. admin
echo 3. password
echo 4. 123456
echo 5. admin123
echo 6. Admin123
echo 7. root
echo 8. (empty password)
echo 9. Custom password
echo.

set /p choice="Select option (1-9) or press Enter to enter custom password: "

if "%choice%"=="1" set TEST_PASSWORD=postgres
if "%choice%"=="2" set TEST_PASSWORD=admin
if "%choice%"=="3" set TEST_PASSWORD=password
if "%choice%"=="4" set TEST_PASSWORD=123456
if "%choice%"=="5" set TEST_PASSWORD=admin123
if "%choice%"=="6" set TEST_PASSWORD=Admin123
if "%choice%"=="7" set TEST_PASSWORD=root
if "%choice%"=="8" set TEST_PASSWORD=

if "%choice%"=="9" (
    set /p TEST_PASSWORD="Enter your custom password: "
)

if "%choice%"=="" (
    set /p TEST_PASSWORD="Enter password to test: "
)

echo.
echo Testing password: "%TEST_PASSWORD%"
echo.

set PGPASSWORD=%TEST_PASSWORD%
"%PSQL_PATH%\psql.exe" -h localhost -p 5432 -U postgres -c "SELECT version();" -d postgres

if %errorlevel%==0 (
    echo.
    echo ✅ SUCCESS! The correct password is: %TEST_PASSWORD%
    echo.
    echo Would you like to update the .env file automatically?
    set /p update="Enter Y to update .env file: "
    
    if /i "%update%"=="Y" (
        powershell -Command "(Get-Content .env) -replace 'DB_PASSWORD=.*', 'DB_PASSWORD=%TEST_PASSWORD%' | Set-Content .env"
        echo ✅ .env file updated successfully!
        echo.
        echo You can now run: npm run dev
    )
) else (
    echo.
    echo ❌ Password "%TEST_PASSWORD%" is incorrect.
    echo Try running this script again with a different password.
)

echo.
pause
