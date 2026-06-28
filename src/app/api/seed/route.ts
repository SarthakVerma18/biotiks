import { NextResponse } from 'next/server';
import { Client } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

export async function GET() {
  const password = '2XRz4u7mh35';
  const directHost = 'db.aodowwjhlsfoxddtzfuf.supabase.co';
  const port = 5432;
  const connectionString = `postgresql://postgres:${password}@${directHost}:${port}/postgres`;

  console.log('Connecting to direct host via IPv6...');
  const client = new Client({
    connectionString,
    ssl: {
      rejectUnauthorized: false
    },
    connectionTimeoutMillis: 15000
  });

  try {
    await client.connect();
    console.log('Connected to Supabase Postgres on Vercel!');

    // Read seed.sql
    const seedSqlPath = path.join(process.cwd(), 'supabase', 'seed.sql');
    const sql = fs.readFileSync(seedSqlPath, 'utf8');

    // Split SQL queries
    const statements = sql
      .split(/;\s*$/m)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    console.log(`Executing ${statements.length} SQL statements...`);
    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i];
      try {
        await client.query(stmt);
      } catch (err: any) {
        console.error(`Error executing statement ${i + 1}:`, err.message);
        throw err;
      }
    }

    await client.end();
    return NextResponse.json({
      success: true,
      message: 'Supabase database successfully initialized and seeded with 60 biology questions!'
    });
  } catch (err: any) {
    console.error('Seeding failed:', err);
    await client.end().catch(() => {});
    return NextResponse.json(
      {
        success: false,
        error: err.message || 'Seeding failed'
      },
      { status: 500 }
    );
  }
}
