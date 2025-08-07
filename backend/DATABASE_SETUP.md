# PostgreSQL Database Setup for Chiya Shop

## Prerequisites
- PostgreSQL installed on your system
- pgAdmin (optional, for GUI management)

## Step 1: Create Database

### Option A: Using pgAdmin (GUI)
1. Open pgAdmin
2. Connect to your PostgreSQL server
3. Right-click on "Databases" → "Create" → "Database"
4. Database name: `chiya_shop_db`
5. Owner: `postgres`
6. Click "Save"

### Option B: Using psql (Command Line)
1. Open Command Prompt or PowerShell as Administrator
2. Navigate to PostgreSQL bin directory (usually `C:\Program Files\PostgreSQL\{version}\bin`)
3. Run the following commands:

```bash
# Connect to PostgreSQL
psql -U postgres

# Run the setup script
\i "D:\Natraj Technology\Website Client\chiya shop\latest\project\backend\scripts\setup_database.sql"

# Exit psql
\q
```

## Step 2: Configure Connection
1. Make sure PostgreSQL service is running
2. Update the `.env` file with your PostgreSQL credentials:
   - `DB_PASSWORD`: Your postgres user password
   - `DB_HOST`: localhost (or your server IP)
   - `DB_PORT`: 5432 (default PostgreSQL port)

## Step 3: Test Connection
1. Start the backend server: `npm run dev`
2. The application will automatically create tables using Sequelize
3. Check the console for "Database connected successfully"

## Step 4: Seed Initial Data
After the tables are created, you can run the seed script:

```sql
-- Run this in psql or pgAdmin query tool
\c chiya_shop_db;
\i "D:\Natraj Technology\Website Client\chiya shop\latest\project\backend\scripts\seed_data.sql"
```

## Default Login Credentials
After seeding:
- **Username**: `admin` | **Password**: `admin123`
- **Username**: `chiya_admin` | **Password**: `chiya123`
- **Username**: `staff1` | **Password**: `chiya123`

## Troubleshooting

### Connection Issues
1. **Check PostgreSQL Service**: 
   - Windows: Services → PostgreSQL
   - Should be "Running"

2. **Check Port**: Default is 5432
   ```bash
   netstat -an | findstr 5432
   ```

3. **Check Password**: 
   - Try connecting with pgAdmin first
   - Update `.env` file with correct password

4. **Firewall**: Make sure port 5432 is not blocked

### Common Errors
- **"password authentication failed"**: Wrong password in `.env`
- **"database does not exist"**: Run the setup script first
- **"connection refused"**: PostgreSQL service not running

## Database Schema
The application will create these main tables:
- `users` - User authentication and profiles
- `restaurants` - Restaurant information
- `tables` - Table management
- `menu_items` - Menu and inventory
- `orders` - Order management
- `staff_attendance` - Staff tracking
- `expenses` - Expense management

## Backup & Restore
```bash
# Backup
pg_dump -U postgres -h localhost chiya_shop_db > chiya_shop_backup.sql

# Restore
psql -U postgres -h localhost chiya_shop_db < chiya_shop_backup.sql
```
