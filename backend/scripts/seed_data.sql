-- Initial data seeding for Chiya Shop
-- Run this after the application has created the tables

-- Insert default admin user
-- Password: 'admin123' (hashed with bcrypt)
INSERT INTO users (
    id, 
    username, 
    email, 
    password, 
    role, 
    profile, 
    is_active, 
    created_at, 
    updated_at
) VALUES (
    uuid_generate_v4(),
    'admin',
    'admin@chiyashop.com',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsJHxhQhu', -- password: 'admin123'
    'admin',
    '{"firstName": "Admin", "lastName": "User", "phone": "+977-9876543210", "position": "Administrator", "permissions": ["all"]}',
    true,
    NOW(),
    NOW()
) ON CONFLICT (username) DO NOTHING;

-- Insert another admin user with different credentials
INSERT INTO users (
    id, 
    username, 
    email, 
    password, 
    role, 
    profile, 
    is_active, 
    created_at, 
    updated_at
) VALUES (
    uuid_generate_v4(),
    'chiya_admin',
    'chiya@chiyashop.com',
    '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password: 'chiya123'
    'admin',
    '{"firstName": "Chiya", "lastName": "Admin", "phone": "+977-9876543211", "position": "Manager", "permissions": ["all"]}',
    true,
    NOW(),
    NOW()
) ON CONFLICT (username) DO NOTHING;

-- Insert staff user for testing
INSERT INTO users (
    id, 
    username, 
    email, 
    password, 
    role, 
    profile, 
    is_active, 
    created_at, 
    updated_at
) VALUES (
    uuid_generate_v4(),
    'staff1',
    'staff@chiyashop.com',
    '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password: 'chiya123'
    'staff',
    '{"firstName": "Staff", "lastName": "Member", "phone": "+977-9876543212", "position": "Waiter", "permissions": ["orders", "tables"]}',
    true,
    NOW(),
    NOW()
) ON CONFLICT (username) DO NOTHING;
