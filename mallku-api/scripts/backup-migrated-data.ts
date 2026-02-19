import postgres from 'postgres';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;
const sql = postgres(DATABASE_URL!, { max: 1 });

async function backup() {
  try {
    console.log('\n💾 Creando backup de datos migrados...\n');

    // Obtener todas las excursiones
    const excursiones = await sql`
      SELECT * FROM excursions ORDER BY orden
    `;

    // Obtener todas las fechas
    const fechas = await sql`
      SELECT * FROM dates ORDER BY fecha
    `;

    // Obtener todas las reservas (si hay)
    const reservas = await sql`
      SELECT * FROM bookings ORDER BY created_at
    `;

    const backup = {
      fecha_backup: new Date().toISOString(),
      version: '1.0',
      datos: {
        excursiones: excursiones.map(e => ({
          ...e,
          created_at: e.created_at?.toISOString(),
          updated_at: e.updated_at?.toISOString(),
        })),
        fechas: fechas.map(f => ({
          ...f,
          fecha: f.fecha?.toISOString(),
          created_at: f.created_at?.toISOString(),
          updated_at: f.updated_at?.toISOString(),
        })),
        reservas: reservas.map(r => ({
          ...r,
          fecha_propuesta: r.fecha_propuesta?.toISOString(),
          created_at: r.created_at?.toISOString(),
          updated_at: r.updated_at?.toISOString(),
          confirmed_at: r.confirmed_at?.toISOString(),
          completed_at: r.completed_at?.toISOString(),
          cancelled_at: r.cancelled_at?.toISOString(),
        })),
      },
      estadisticas: {
        total_excursiones: excursiones.length,
        total_fechas: fechas.length,
        total_reservas: reservas.length,
      }
    };

    // Crear directorio de backups si no existe
    const backupsDir = path.join(process.cwd(), 'backups');
    if (!fs.existsSync(backupsDir)) {
      fs.mkdirSync(backupsDir);
    }

    // Guardar backup con timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
    const filename = `backup-${timestamp}.json`;
    const filepath = path.join(backupsDir, filename);

    fs.writeFileSync(filepath, JSON.stringify(backup, null, 2));

    console.log(`✅ Backup guardado en: ${filepath}\n`);
    console.log('📊 Estadísticas del backup:');
    console.log(`   - Excursiones: ${backup.estadisticas.total_excursiones}`);
    console.log(`   - Fechas: ${backup.estadisticas.total_fechas}`);
    console.log(`   - Reservas: ${backup.estadisticas.total_reservas}`);
    console.log('');

  } catch (error) {
    console.error('❌ Error creando backup:', error);
    throw error;
  } finally {
    await sql.end();
  }
}

backup();
