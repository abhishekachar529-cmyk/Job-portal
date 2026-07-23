const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
  console.log('=================================');
  console.log('Testing MongoDB Connection');
  console.log('=================================');
  console.log('Connection String:', process.env.MONGODB_URI);
  console.log('---------------------------------');
  
  try {
    console.log('🔄 Attempting to connect...');
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ CONNECTION SUCCESSFUL!');
    console.log(`📁 Database: ${conn.connection.name}`);
    console.log(`📍 Host: ${conn.connection.host}`);
    console.log('=================================');
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ CONNECTION FAILED!');
    console.error('Error:', error.message);
    console.log('=================================');
  }
}

testConnection();