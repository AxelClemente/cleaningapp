const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');

// Carga las variables de entorno del archivo .env
dotenv.config({ path: '.env' });

async function testConnection() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not defined');
  }

  console.log('MONGODB_URI:', uri); // Para verificar que se está leyendo correctamente

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected successfully to MongoDB');
    await client.db().command({ ping: 1 });
    console.log('MongoDB is responsive');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  } finally {
    await client.close();
  }
}

testConnection();