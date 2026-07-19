import test from 'node:test';
import assert from 'node:assert/strict';

import { closeDatabase, initializeDatabase, run } from './database/sqlite.js';
import { calculateTieredPrice, calculateTieredPriceWithVat } from './pricing.js';

test.before(async () => {
  await initializeDatabase();
  await run('DELETE FROM impuestos;');
  await run('INSERT INTO impuestos (country_name, tax_name, percentage) VALUES (?, ?, ?);', ['ES', 'IVA', 21]);
  await run('INSERT INTO impuestos (country_name, tax_name, percentage) VALUES (?, ?, ?);', ['DE', 'MwSt', 19]);
  await run('INSERT INTO impuestos (country_name, tax_name, percentage) VALUES (?, ?, ?);', ['US', 'Sales Tax', 0]);
});

test.after(async () => {
  await closeDatabase();
});

test('calcula coste base por tramos para 5 usuarios', () => {
  assert.equal(calculateTieredPrice(5), 50);
});

test('calcula coste base por tramos para 15 usuarios', () => {
  assert.equal(calculateTieredPrice(15), 140);
});

test('calcula coste base por tramos para 55 usuarios', () => {
  assert.equal(calculateTieredPrice(55), 445);
});

test('aplica impuesto segun pais recibido', async () => {
  assert.equal(await calculateTieredPriceWithVat(15, 'ES'), 169.4);
  assert.equal(await calculateTieredPriceWithVat(15, 'DE'), 166.6);
  assert.equal(await calculateTieredPriceWithVat(15, 'US'), 140);
});

test('usa IVA por defecto cuando el pais no esta mapeado', async () => {
  assert.equal(await calculateTieredPriceWithVat(5, 'XX'), 60.5);
});

test('lanza error cuando el numero de usuarios no es entero positivo', () => {
  assert.throws(() => calculateTieredPrice(0));
  assert.throws(() => calculateTieredPrice(-1));
  assert.throws(() => calculateTieredPrice(2.5));
});
