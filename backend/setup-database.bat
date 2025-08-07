@echo off
echo ========================================
echo    Chiya Shop Database Setup
echo ========================================
echo.

echo This script will help you set up PostgreSQL database for Chiya Shop.
echo.

echo Prerequisites:
echo - PostgreSQL installed and running
echo - PostgreSQL bin directory in PATH
echo.

pause

echo.
echo Testing PostgreSQL connection...
psql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: PostgreSQL CLI not found!
    echo Please add PostgreSQL bin directory to your PATH
    echo Example: C:\Program Files\PostgreSQL\15\bin
    pause
    exit /b 1
)

echo PostgreSQL CLI found!
echo.

set /p DB_HOST="Enter PostgreSQL host (localhost): "
if "%DB_HOST%"=="" set DB_HOST=localhost

set /p DB_PORT="Enter PostgreSQL port (5432): "
if "%DB_PORT%"=="" set DB_PORT=5432

set /p DB_USER="Enter PostgreSQL username (postgres): "
if "%DB_USER%"=="" set DB_USER=postgres

set /p DB_PASSWORD="Enter PostgreSQL password: "
if "%DB_PASSWORD%"=="" (
    echo ERROR: Password is required!
    pause
    exit /b 1
)

echo.
echo Creating database 'chiya_shop_db'...

set PGPASSWORD=%DB_PASSWORD%
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -c "CREATE DATABASE chiya_shop_db;" 2>nul
if %errorlevel% neq 0 (
    echo Database 'chiya_shop_db' may already exist or connection failed.
    echo Continuing with setup...
)

echo.
echo Updating .env file...

(
echo # Application Configuration
echo NODE_ENV=development
echo PORT=3001
echo API_VERSION=v1
echo.
echo # Frontend URL
echo FRONTEND_URL=http://localhost:5173
echo.
echo # Database Configuration
echo DB_HOST=%DB_HOST%
echo DB_PORT=%DB_PORT%
echo DB_NAME=chiya_shop_db
echo DB_USER=%DB_USER%
echo DB_PASSWORD=%DB_PASSWORD%
echo DB_DIALECT=postgres
echo DB_LOGGING=true
echo.
echo # JWT Configuration
echo JWT_SECRET=chiya-shop-super-secret-jwt-key-2024-development-mode
echo JWT_EXPIRE=7d
echo JWT_REFRESH_SECRET=chiya-shop-super-secret-refresh-jwt-key-2024
echo JWT_REFRESH_EXPIRE=30d
echo.
echo # Redis Configuration
echo REDIS_HOST=localhost
echo REDIS_PORT=6379
echo REDIS_PASSWORD=
echo.
echo # Email Configuration
echo SMTP_HOST=smtp.gmail.com
echo SMTP_PORT=587
echo SMTP_USER=your-email@gmail.com
echo SMTP_PASS=your-app-password
echo FROM_EMAIL=noreply@chiyashop.com
echo FROM_NAME=Chiya Shop
echo.
echo # Security Configuration
echo BCRYPT_ROUNDS=12
echo RATE_LIMIT_WINDOW=15
echo RATE_LIMIT_MAX=100
echo.
echo # File Upload Configuration
echo MAX_FILE_SIZE=5242880
echo ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,application/pdf
echo.
echo # Pagination
echo DEFAULT_PAGE_SIZE=10
echo MAX_PAGE_SIZE=100
) > .env

echo.
echo ========================================
echo    Setup Complete!
echo ========================================
echo.
echo Database: chiya_shop_db
echo Host: %DB_HOST%:%DB_PORT%
echo User: %DB_USER%
echo.
echo Next steps:
echo 1. Run: npm run dev
echo 2. The app will create tables automatically
echo 3. Default users will be created:
echo    - admin / admin123
echo    - chiya_admin / chiya123
echo.
echo ========================================
pause
