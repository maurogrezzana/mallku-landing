import { createToken } from '../src/lib/auth';
import dotenv from 'dotenv';

dotenv.config();

async function generate() {
  const jwtSecret = process.env.JWT_SECRET || '';

  if (!jwtSecret) {
    console.error('❌ JWT_SECRET no encontrado en .env');
    process.exit(1);
  }

  const token = await createToken(
    {
      sub: 'test-admin-id',
      email: 'Mallkuexcursiones@gmail.com',
      role: 'admin',
      name: 'Administrador',
    },
    jwtSecret
  );

  console.log('\n🔑 Token de prueba generado:\n');
  console.log(token);
  console.log('\n💡 Usar en requests con:');
  console.log(`   -H "Authorization: Bearer ${token}"\n`);
}

generate();
