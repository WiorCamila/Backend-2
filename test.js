import mongoose from 'mongoose';
import { MONGO_URI } from './config.js';  

async function testMongoConnection() {
  try {
    await mongoose.connect(MONGO_URI, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true 
    });
    
    console.log('Conexión exitosa a MongoDB Atlas');
    
    const result = await mongoose.connection.db.collection('test').find({}).toArray();
    console.log('Resultado de la consulta de prueba:', result);

    await mongoose.disconnect();
    console.log('Conexión cerrada correctamente');
  } catch (error) {
    console.error('Error de conexión:', error);
  }
}

testMongoConnection();
