-- Chiya Shop Database Setup Script
-- Run this script as PostgreSQL superuser (postgres)

-- Create database
CREATE DATABASE chiya_shop_db
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'English_United States.1252'
    LC_CTYPE = 'English_United States.1252'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

-- Create application user (optional, for better security)
-- CREATE USER chiya_user WITH PASSWORD 'chiya_password_2024';
-- GRANT ALL PRIVILEGES ON DATABASE chiya_shop_db TO chiya_user;

-- Connect to the database
\c chiya_shop_db;

-- Enable UUID extension for primary keys
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pg_crypto for password hashing (if needed)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create schema for better organization
CREATE SCHEMA IF NOT EXISTS chiya_app;

-- Grant permissions on schema
-- GRANT ALL ON SCHEMA chiya_app TO chiya_user;

-- Set default schema search path
-- ALTER DATABASE chiya_shop_db SET search_path TO chiya_app, public;

COMMENT ON DATABASE chiya_shop_db IS 'Chiya Shop Restaurant Management System Database';
