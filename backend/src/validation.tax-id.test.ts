import test from 'node:test';
import assert from 'node:assert/strict';

import { isValidSpanishTaxId, parseCountry, parseOptionalTaxId, parseOptionalTaxIdForCountry } from './validation.js';

test('acepta DNI validos con modulo 23', () => {
  assert.equal(isValidSpanishTaxId('12345678Z'), true);
  assert.equal(isValidSpanishTaxId('00000000T'), true);
});

test('rechaza DNI invalidos por letra incorrecta', () => {
  assert.equal(isValidSpanishTaxId('12345678A'), false);
  assert.equal(isValidSpanishTaxId('00000000R'), false);
});

test('acepta NIF/NIE validos con prefijo X/Y/Z y modulo 23', () => {
  assert.equal(isValidSpanishTaxId('X1234567L'), true);
  assert.equal(isValidSpanishTaxId('Y1234567X'), true);
  assert.equal(isValidSpanishTaxId('Z1234567R'), true);
});

test('rechaza NIF/NIE invalidos por letra de control incorrecta', () => {
  assert.equal(isValidSpanishTaxId('X1234567A'), false);
  assert.equal(isValidSpanishTaxId('Y1234567A'), false);
  assert.equal(isValidSpanishTaxId('Z1234567A'), false);
});

test('acepta CIF validos con control numerico y alfabetico', () => {
  assert.equal(isValidSpanishTaxId('B12345674'), true);
  assert.equal(isValidSpanishTaxId('P2345678C'), true);
});

test('rechaza CIF invalidos por control incorrecto', () => {
  assert.equal(isValidSpanishTaxId('B12345670'), false);
  assert.equal(isValidSpanishTaxId('P2345678A'), false);
});

test('parseOptionalTaxId normaliza a mayusculas y valida', () => {
  assert.equal(parseOptionalTaxId('x1234567l'), 'X1234567L');
  assert.equal(parseOptionalTaxId(null), null);
  assert.equal(parseOptionalTaxId(undefined), null);
});

test('parseOptionalTaxId lanza error en identificadores invalidos', () => {
  assert.throws(() => parseOptionalTaxId('12345678A'));
  assert.throws(() => parseOptionalTaxId('B12345670'));
});

test('parseOptionalTaxIdForCountry valida DNI/NIF/CIF solo para ES', () => {
  assert.equal(parseOptionalTaxIdForCountry('ES', 'x1234567l'), 'X1234567L');
  assert.throws(() => parseOptionalTaxIdForCountry('ES', 'tax-id-invalido'));
});

test('parseOptionalTaxIdForCountry no aplica validacion espanola fuera de ES', () => {
  assert.equal(parseOptionalTaxIdForCountry('US', 'tax-id-invalido'), 'TAX-ID-INVALIDO');
  assert.equal(parseOptionalTaxIdForCountry('FR', 'ab-123-456'), 'AB-123-456');
});

test('parseCountry acepta codigos ISO de pais en minuscula y los normaliza', () => {
  assert.equal(parseCountry('es'), 'ES');
  assert.equal(parseCountry(' mx '), 'MX');
});

test('parseCountry permite cualquier pais no vacio y lo normaliza', () => {
  assert.equal(parseCountry('zz'), 'ZZ');
  assert.equal(parseCountry('España'), 'ESPAÑA');
});
