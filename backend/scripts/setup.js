const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🔧 Setting up PostgreSQL database for Chiya Shop...\n');

// Check if PostgreSQL is accessible
try {
  console.log('📋 Checking PostgreSQL connection...');
  execSync('psql --version', { stdio: 'pipe' });
  console.log('✅ PostgreSQL CLI found\n');
} catch (error) {
  console.log('❌ PostgreSQL CLI not found in PATH');
  console.log('Please add PostgreSQL bin directory to your PATH environment variable');
  console.log('Example: C:\\Program Files\\PostgreSQL\\15\\bin\n');
  process.exit(1);
}

// Get database credentials
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

async function setupDatabase() {
  try {
    console.log('🔐 Please provide PostgreSQL credentials:\n');
    
    const host = await askQuestion('Host (localhost): ') || 'localhost';
    const port = await askQuestion('Port (5432): ') || '5432';
    const username = await askQuestion('Username (postgres): ') || 'postgres';
    const password = await askQuestion('Password: ');
    
    if (!password) {
      console.log('❌ Password is required');
      process.exit(1);
    }
    
    console.log('\n🚀 Creating database...');
    
    // Set environment variable for password
    process.env.PGPASSWORD = password;
    
    // Create database
    try {
      execSync(`psql -h ${host} -p ${port} -U ${username} -c "CREATE DATABASE chiya_shop_db;"`, 
        { stdio: 'pipe' });
      console.log('✅ Database "chiya_shop_db" created successfully');
    } catch (error) {
      if (error.stderr.toString().includes('already exists')) {
        console.log('ℹ️  Database "chiya_shop_db" already exists');
      } else {
        console.log('❌ Failed to create database:', error.stderr.toString());
        process.exit(1);
      }
    }
    
    // Update .env file
    console.log('📝 Updating .env file...');
    const envPath = path.join(__dirname, '..', '.env');
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    envContent = envContent.replace(/DB_HOST=.*/, `DB_HOST=${host}`);
    envContent = envContent.replace(/DB_PORT=.*/, `DB_PORT=${port}`);
    envContent = envContent.replace(/DB_USER=.*/, `DB_USER=${username}`);
    envContent = envContent.replace(/DB_PASSWORD=.*/, `DB_PASSWORD=${password}`);
    
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Environment file updated');
    
    console.log('\n🎉 Database setup completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Start the application: npm run dev');
    console.log('2. The app will automatically create tables');
    console.log('3. Check the console for "Database connected successfully"');
    console.log('\nDefault login credentials will be:');
    console.log('- Username: admin, Password: admin123');
    console.log('- Username: chiya_admin, Password: chiya123');
    
  } catch (error) {
    console.log('❌ Setup failed:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

setupDatabase();
