require('dotenv').config();

const dns = require('dns');
const mongoose = require('mongoose');

// Force Google DNS
dns.setServers(['8.8.8.8', '8.8.4.4']);

async function testConnection() {
  try {
    console.log('=================================');
    console.log('Testing MongoDB Connection');
    console.log('=================================');

    console.log('DNS Servers:', dns.getServers());
    console.log('Connection String:', process.env.MONGODB_URI);

    console.log('---------------------------------');
    console.log('🔄 Connecting to MongoDB...');

    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log('✅ CONNECTION SUCCESSFUL!');
    console.log(`📦 Database: ${conn.connection.name}`);
    console.log(`🖥️ Host: ${conn.connection.host}`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.log('❌ CONNECTION FAILED!');
    console.error(error);
    process.exit(1);
  }
}

testConnection();