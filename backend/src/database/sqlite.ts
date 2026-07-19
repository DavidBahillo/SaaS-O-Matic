import { mkdirSync } from 'node:fs';
import { randomBytes, scrypt as scryptCallback } from 'node:crypto';
import path from 'node:path';
import { promisify } from 'node:util';

import sqlite3 from 'sqlite3';

sqlite3.verbose();

const scryptAsync = promisify(scryptCallback);

const databaseFilePath = process.env.DATABASE_PATH ?? path.resolve(process.cwd(), 'data', 'app.db');
mkdirSync(path.dirname(databaseFilePath), { recursive: true });

const database = new sqlite3.Database(databaseFilePath);
//Se crea un usuario por defecto para poder acceder a la aplicación, este usuario es un administrador (rol: 'admin') (Eliminar cuando se lleve a producción real) y tiene los siguientes datos:
const DEFAULT_USER = {
  rol: 'admin' as const,
  nombre: 'David',
  apellido: 'Bahillo',
  email: 'akisbahillo@gmail.com',
  contrasena: '123456789',
};
//Se crea un usuario por defecto para poder acceder a la aplicación, este usuario es un usuario estándar (rol: 'usuario') (Eliminar cuando se lleve a producción real) y tiene los siguientes datos:
const DEFAULT_STANDARD_USER = {
  rol: 'usuario' as const,
  nombre: 'Usuario',
  apellido: 'Demo',
  email: 'usuario@saasomatic.com',
  contrasena: '123456789',
};

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${salt}:${derivedKey.toString('hex')}`;
}

export async function initializeDatabase(): Promise<void> {
  await exec('PRAGMA foreign_keys = ON;');

  await migrateCountryConstraints();

  await exec(`
    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company_name TEXT NOT NULL,
      tax_id TEXT,
      contact_email TEXT NOT NULL,
      country TEXT NOT NULL,
      plan_id TEXT CHECK (plan_id IN ('Plan Starter', 'Plan Pro', 'Plan Enterprise')),
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      apellido TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      contrasena TEXT NOT NULL,
      rol TEXT NOT NULL DEFAULT 'usuario',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await migrateUserRoleColumn();

  await exec(`
    CREATE TABLE IF NOT EXISTS simulations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id INTEGER NOT NULL,
      budget_name TEXT NOT NULL,
      active_users INTEGER NOT NULL,
      storage REAL NOT NULL,
      api_calls INTEGER NOT NULL,
      total_cost REAL NOT NULL,
      currency TEXT NOT NULL DEFAULT 'EUR',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (customer_id)
        REFERENCES customers(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
    );
  `);

  await migrateSimulationCurrencyColumn();
  await migrateSimulationBudgetNameColumn();

  await exec(`
    CREATE TABLE IF NOT EXISTS impuestos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      country_name TEXT NOT NULL UNIQUE,
      tax_name TEXT NOT NULL,
      percentage REAL NOT NULL CHECK (percentage >= 0 AND percentage <= 100),
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await exec(`
    CREATE TABLE IF NOT EXISTS pricing_tiers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      level INTEGER NOT NULL UNIQUE CHECK (level > 0),
      user_limit INTEGER CHECK (user_limit IS NULL OR user_limit > 0),
      price_per_user REAL NOT NULL CHECK (price_per_user >= 0),
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await exec(`
    CREATE INDEX IF NOT EXISTS idx_simulations_customer_id
    ON simulations(customer_id);
  `);

  await exec(`
    CREATE INDEX IF NOT EXISTS idx_pricing_tiers_level
    ON pricing_tiers(level);
  `);

  await exec(`
    CREATE INDEX IF NOT EXISTS idx_users_email
    ON users(email);
  `);

  await ensureDefaultPricingTiers();
  await ensureDefaultUsers();
}

async function migrateUserRoleColumn(): Promise<void> {
  const userColumns = await all<{ name: string }>('PRAGMA table_info(users);');
  const hasRoleColumn = userColumns.some((column) => column.name === 'rol');

  if (!hasRoleColumn) {
    await exec("ALTER TABLE users ADD COLUMN rol TEXT NOT NULL DEFAULT 'usuario';");
  }
}

async function migrateCountryConstraints(): Promise<void> {
  await exec('DROP TRIGGER IF EXISTS trg_customers_country_insert;');
  await exec('DROP TRIGGER IF EXISTS trg_customers_country_update;');
  await exec('DROP TRIGGER IF EXISTS trg_impuestos_country_insert;');
  await exec('DROP TRIGGER IF EXISTS trg_impuestos_country_update;');

  const customersTable = await get<{ sql: string | null }>(
    "SELECT sql FROM sqlite_master WHERE type = 'table' AND name = 'customers';",
  );

  if ((customersTable?.sql ?? '').toUpperCase().includes('CHECK (COUNTRY IN')) {
    await exec('PRAGMA foreign_keys = OFF;');
    await exec('BEGIN TRANSACTION;');

    try {
      await exec(`
        CREATE TABLE customers_new (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          company_name TEXT NOT NULL,
          tax_id TEXT,
          contact_email TEXT NOT NULL,
          country TEXT NOT NULL,
          plan_id TEXT CHECK (plan_id IN ('Plan Starter', 'Plan Pro', 'Plan Enterprise')),
          created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
      `);

      await exec(`
        INSERT INTO customers_new (id, company_name, tax_id, contact_email, country, plan_id, created_at)
        SELECT id, company_name, tax_id, contact_email, country, plan_id, created_at
        FROM customers;
      `);

      await exec('DROP TABLE customers;');
      await exec('ALTER TABLE customers_new RENAME TO customers;');
      await exec('COMMIT;');
    } catch (error) {
      await exec('ROLLBACK;');
      throw error;
    } finally {
      await exec('PRAGMA foreign_keys = ON;');
    }
  }

  const taxesTable = await get<{ sql: string | null }>(
    "SELECT sql FROM sqlite_master WHERE type = 'table' AND name = 'impuestos';",
  );

  if ((taxesTable?.sql ?? '').toUpperCase().includes('CHECK (COUNTRY_NAME IN')) {
    await exec('BEGIN TRANSACTION;');

    try {
      await exec(`
        CREATE TABLE impuestos_new (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          country_name TEXT NOT NULL UNIQUE,
          tax_name TEXT NOT NULL,
          percentage REAL NOT NULL CHECK (percentage >= 0 AND percentage <= 100),
          created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
      `);

      await exec(`
        INSERT INTO impuestos_new (id, country_name, tax_name, percentage, created_at)
        SELECT id, country_name, tax_name, percentage, created_at
        FROM impuestos;
      `);

      await exec('DROP TABLE impuestos;');
      await exec('ALTER TABLE impuestos_new RENAME TO impuestos;');
      await exec('COMMIT;');
    } catch (error) {
      await exec('ROLLBACK;');
      throw error;
    }
  }
}

async function migrateSimulationCurrencyColumn(): Promise<void> {
  const simulationColumns = await all<{ name: string }>('PRAGMA table_info(simulations);');
  const hasCurrencyColumn = simulationColumns.some(column => column.name === 'currency');

  if (hasCurrencyColumn) {
    return;
  }

  await exec("ALTER TABLE simulations ADD COLUMN currency TEXT NOT NULL DEFAULT 'EUR';");
}

async function migrateSimulationBudgetNameColumn(): Promise<void> {
  const simulationColumns = await all<{ name: string }>('PRAGMA table_info(simulations);');
  const hasBudgetNameColumn = simulationColumns.some(column => column.name === 'budget_name');

  if (hasBudgetNameColumn) {
    return;
  }

  await exec("ALTER TABLE simulations ADD COLUMN budget_name TEXT NOT NULL DEFAULT 'Simulación';");
}

async function ensureDefaultPricingTiers(): Promise<void> {
  const row = await get<{ total: number }>('SELECT COUNT(*) AS total FROM pricing_tiers;');

  if ((row?.total ?? 0) > 0) {
    return;
  }

  await run(
    `
      INSERT INTO pricing_tiers (level, user_limit, price_per_user)
      VALUES (?, ?, ?), (?, ?, ?), (?, ?, ?);
    `,
    [1, 10, 10, 2, 50, 8, 3, null, 5],
  );
}

async function ensureDefaultUsers(): Promise<void> {
  await ensureSeedUser(DEFAULT_USER);
  await ensureSeedUser(DEFAULT_STANDARD_USER);
}

async function ensureSeedUser(user: {
  rol: 'admin' | 'usuario';
  nombre: string;
  apellido: string;
  email: string;
  contrasena: string;
}): Promise<void> {
  const existingUser = await get<{ id: number; rol: string }>('SELECT id, rol FROM users WHERE email = ?;', [
    user.email,
  ]);

  if (existingUser !== undefined) {
    if (existingUser.rol !== user.rol) {
      await run('UPDATE users SET rol = ? WHERE id = ?;', [user.rol, existingUser.id]);
    }
    return;
  }

  const hashedPassword = await hashPassword(user.contrasena);

  await run(
    `
      INSERT INTO users (nombre, apellido, email, contrasena, rol)
      VALUES (?, ?, ?, ?, ?);
    `,
    [user.nombre, user.apellido, user.email, hashedPassword, user.rol],
  );
}

export function closeDatabase(): Promise<void> {
  return new Promise((resolve, reject) => {
    database.close(error => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });
}

export function run(
  sql: string,
  parameters: readonly unknown[] = [],
): Promise<{ lastId: number; changes: number }> {
  return new Promise((resolve, reject) => {
    database.run(sql, parameters as never, function runCallback(error: Error | null): void {
      if (error) {
        reject(error);
        return;
      }

      resolve({ lastId: this.lastID, changes: this.changes });
    });
  });
}

export function get<T>(sql: string, parameters: readonly unknown[] = []): Promise<T | undefined> {
  return new Promise((resolve, reject) => {
    database.get(sql, parameters as never, (error: Error | null, row: T | undefined) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(row);
    });
  });
}

export function all<T>(sql: string, parameters: readonly unknown[] = []): Promise<T[]> {
  return new Promise((resolve, reject) => {
    database.all(sql, parameters as never, (error: Error | null, rows: T[] | undefined) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(rows ?? []);
    });
  });
}

export async function exec(sql: string): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    database.exec(sql, error => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });
}

export { databaseFilePath };
