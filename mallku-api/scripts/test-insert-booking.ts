import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;
const sql = postgres(DATABASE_URL!, { max: 1 });

async function testInsert() {
  try {
    console.log('🧪 Testing booking insert directly...\n');

    // Get a date
    const [date] = await sql`
      SELECT d.*, e.id as excursion_id, e.precio_base
      FROM dates d
      JOIN excursions e ON d.excursion_id = e.id
      WHERE d.estado = 'disponible'
      LIMIT 1;
    `;

    console.log('Using date:', {
      id: date.id,
      excursion_id: date.excursion_id,
      precio_base: date.precio_base
    });

    const bookingNumber = `MALLKU-TEST-${Date.now()}`;
    const precioTotal = date.precio_base * 2; // 2 personas

    // Direct insert
    const [booking] = await sql`
      INSERT INTO bookings (
        booking_number,
        tipo,
        date_id,
        excursion_id,
        nombre_completo,
        email,
        telefono,
        cantidad_personas,
        precio_total,
        status,
        payment_status,
        confirmed_at
      ) VALUES (
        ${bookingNumber},
        'fecha-fija',
        ${date.id},
        ${date.excursion_id},
        'Juan Test',
        'test@test.com',
        '123456789',
        2,
        ${precioTotal},
        'confirmed',
        'pending',
        now()
      )
      RETURNING *;
    `;

    console.log('\n✅ Booking created successfully!');
    console.log('Booking number:', booking.booking_number);
    console.log('Status:', booking.status);
    console.log('Tipo:', booking.tipo);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await sql.end();
  }
}

testInsert();
