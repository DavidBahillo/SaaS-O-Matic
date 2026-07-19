import dotenv from 'dotenv';

import { all, closeDatabase, exec, initializeDatabase, run } from './database/sqlite.js';

dotenv.config();

type TableRow = {
  name: string;
};

function quoteIdentifier(identifier: string): string {
  return `"${identifier.replaceAll('"', '""')}"`;
}

async function resetDatabase(): Promise<void> {
  await initializeDatabase();

  try {
    await exec('PRAGMA foreign_keys = OFF;');

    const tables = await all<TableRow>(`
      SELECT name
      FROM sqlite_master
      WHERE type = 'table'
        AND name NOT LIKE 'sqlite_%'
      ORDER BY name;
    `);

    for (const table of tables) {
      await run(`DELETE FROM ${quoteIdentifier(table.name)};`);
    }

    await run('DELETE FROM sqlite_sequence;');
    await exec('PRAGMA foreign_keys = ON;');
    await exec('VACUUM;');
    await initializeDatabase();

    console.log('Base de datos reiniciada.');
  } finally {
    await closeDatabase();
  }
}

void resetDatabase().catch(async error => {
  try {
    await closeDatabase();
  } catch {
    // Ignore close errors while surfacing the original failure.
  }

  console.error('No se pudo reiniciar la base de datos.');
  console.error(error);
  process.exitCode = 1;
});