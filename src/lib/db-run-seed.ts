import { Client } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

async function seedDatabase() {
  const password = '2XRz4u7mh35';
  const projectId = 'aodowwjhlsfoxddtzfuf';
  
  // Connect to the IPv4 address of Singapore pooler directly
  // This bypasses DNS and IPv6 resolution issues
  const host = '54.255.219.82'; // One of the IPs resolved for Singapore pooler
  const port = 6543;
  
  console.log(`Connecting to pooler IP: ${host} on port ${port} with SNI servername: db.${projectId}.supabase.co...`);
  const client = new Client({
    user: `postgres.${projectId}`,
    host: host,
    database: 'postgres',
    password: password,
    port: port,
    ssl: {
      rejectUnauthorized: false,
      servername: `db.${projectId}.supabase.co` // Set SNI server name for tenant routing
    },
    connectionTimeoutMillis: 10000
  });
  
  try {
    await client.connect();
    console.log('🎉 SUCCESS! Connected to Supabase Postgres!');

    console.log('Reading seed.sql...');
    const seedSqlPath = path.join(process.cwd(), 'supabase', 'seed.sql');
    const sql = fs.readFileSync(seedSqlPath, 'utf8');

    console.log('Executing seed script...');
    const statements = sql
      .split(/;\s*$/m)
      .map(s => s.trim())
      .filter(s => s.length > 0);

    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i];
      try {
        await client.query(stmt);
      } catch (err: any) {
        console.error(`Error executing statement ${i + 1}:`, err.message);
        console.error('Statement:', stmt.substring(0, 100) + '...');
        throw err;
      }
    }

    console.log('Database seeded successfully!');
  } catch (err: any) {
    console.error('Connection/Seeding failed:', err.message);
  } finally {
    await client.end().catch(() => {});
  }
}

seedDatabase();
