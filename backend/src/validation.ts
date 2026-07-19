import { badRequest } from './errors.js';
import { normalizeCountryCode } from './countryOptions.js';
import type { PlanOption } from './models/index.js';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PLAN_OPTIONS: PlanOption[] = ['Plan Starter', 'Plan Pro', 'Plan Enterprise'];
const USER_ROLES = ['admin', 'usuario'] as const;

export function parseString(value: unknown, fieldName: string): string {
  if (typeof value !== 'string') {
    throw badRequest(`El campo ${fieldName} es obligatorio y debe ser texto.`);
  }

  const trimmedValue = value.trim();

  if (trimmedValue.length === 0) {
    throw badRequest(`El campo ${fieldName} es obligatorio y no puede estar vacío.`);
  }

  return trimmedValue;
}

export function parseOptionalString(value: unknown): string | null {
  if (value === undefined || value === null) {
    return null;
  }

  if (typeof value !== 'string') {
    throw badRequest('El valor debe ser texto o nulo.');
  }

  const trimmedValue = value.trim();
  return trimmedValue.length === 0 ? null : trimmedValue;
}

const DNI_CONTROL_LETTERS = 'TRWAGMYFPDXBNJZSQVHLCKE';
const CIF_CONTROL_LETTERS = 'JABCDEFGHI';

function isDigitCharacter(character: string): boolean {
  const code = character.charCodeAt(0);
  return code >= 48 && code <= 57;
}

function toUpperTrimmed(value: string): string {
  return value.trim().toUpperCase();
}

function isValidDni(value: string): boolean {
  if (value.length !== 9) {
    return false;
  }

  const digits = value.slice(0, 8);

  for (const char of digits) {
    if (!isDigitCharacter(char)) {
      return false;
    }
  }

  const controlLetter = value.charAt(8);
  const index = Number(digits) % 23;
  return controlLetter === DNI_CONTROL_LETTERS[index];
}

function isValidNie(value: string): boolean {
  if (value.length !== 9) {
    return false;
  }

  const prefix = value.charAt(0);

  let prefixDigit = '';
  if (prefix === 'X') {
    prefixDigit = '0';
  } else if (prefix === 'Y') {
    prefixDigit = '1';
  } else if (prefix === 'Z') {
    prefixDigit = '2';
  } else {
    return false;
  }

  const middleDigits = value.slice(1, 8);

  for (const char of middleDigits) {
    if (!isDigitCharacter(char)) {
      return false;
    }
  }

  const controlLetter = value.charAt(8);
  const index = Number(`${prefixDigit}${middleDigits}`) % 23;
  return controlLetter === DNI_CONTROL_LETTERS[index];
}

function isValidCif(value: string): boolean {
  if (value.length !== 9) {
    return false;
  }

  const firstLetter = value.charAt(0);
  const digits = value.slice(1, 8);
  const control = value.charAt(8);

  if (firstLetter < 'A' || firstLetter > 'Z') {
    return false;
  }

  for (const char of digits) {
    if (!isDigitCharacter(char)) {
      return false;
    }
  }

  let sumEvenPositions = 0;
  let sumOddPositions = 0;

  for (let index = 0; index < digits.length; index += 1) {
    const digit = Number(digits[index]);
    const position = index + 1;

    if (position % 2 === 0) {
      sumEvenPositions += digit;
      continue;
    }

    const doubled = digit * 2;
    sumOddPositions += Math.floor(doubled / 10) + (doubled % 10);
  }

  const total = sumEvenPositions + sumOddPositions;
  const controlDigit = (10 - (total % 10)) % 10;
  const expectedDigit = String(controlDigit);
  const expectedLetter = CIF_CONTROL_LETTERS[controlDigit];

  if ('ABEH'.includes(firstLetter)) {
    return control === expectedDigit;
  }

  if ('KPQS'.includes(firstLetter)) {
    return control === expectedLetter;
  }

  return control === expectedDigit || control === expectedLetter;
}

export function isValidSpanishTaxId(value: string): boolean {
  const normalizedValue = toUpperTrimmed(value);

  if (normalizedValue.length !== 9) {
    return false;
  }

  const firstCharacter = normalizedValue.charAt(0);

  if (isDigitCharacter(firstCharacter)) {
    return isValidDni(normalizedValue);
  }

  if ('XYZ'.includes(firstCharacter)) {
    return isValidNie(normalizedValue);
  }

  return isValidCif(normalizedValue);
}

export function parseOptionalTaxId(value: unknown): string | null {
  const parsedValue = parseOptionalString(value);

  if (parsedValue === null) {
    return null;
  }

  const normalizedValue = toUpperTrimmed(parsedValue);

  if (!isValidSpanishTaxId(normalizedValue)) {
    throw badRequest('El campo del identificador fiscal no es un DNI/NIF/CIF válido.');
  }

  return normalizedValue;
}

export function parseEmail(value: unknown, fieldName: string): string {
  const email = parseString(value, fieldName);

  if (!EMAIL_PATTERN.test(email)) {
    throw badRequest(`El campo ${fieldName} no tiene un formato válido.`);
  }

  return email.toLowerCase();
}

export function parseCountry(value: unknown, fieldName = 'country'): string {
  const country = parseString(value, fieldName);
  return normalizeCountryCode(country);
}

export function parsePositiveInteger(value: unknown, fieldName: string): number {
  if (typeof value !== 'number' || !Number.isInteger(value) || value <= 0) {
    throw badRequest(`El campo ${fieldName} debe ser un entero mayor que 0.`);
  }

  return value;
}

export function parseNonNegativeInteger(value: unknown, fieldName: string): number {
  if (typeof value !== 'number' || !Number.isInteger(value) || value < 0) {
    throw badRequest(`El campo ${fieldName} debe ser un entero mayor o igual que 0.`);
  }

  return value;
}

export function parseNonNegativeNumber(value: unknown, fieldName: string): number {
  if (typeof value !== 'number' || Number.isNaN(value) || value < 0) {
    throw badRequest(`El campo ${fieldName} debe ser un número mayor o igual que 0.`);
  }

  return value;
}

export function parsePercentage(value: unknown, fieldName: string): number {
  if (typeof value !== 'number' || Number.isNaN(value) || value < 0 || value > 100) {
    throw badRequest(`El campo ${fieldName} debe ser un número entre 0 y 100.`);
  }

  return value;
}

export function parseOptionalInteger(value: unknown, fieldName: string): number | null {
  if (value === undefined || value === null) {
    return null;
  }

  if (typeof value !== 'number' || !Number.isInteger(value)) {
    throw badRequest(`El campo ${fieldName} debe ser un entero válido.`);
  }

  return value;
}

export function parseOptionalPlan(value: unknown): PlanOption | null {
  if (value === undefined || value === null) {
    return null;
  }

  const plan = parseString(value, 'planId');

  if (!PLAN_OPTIONS.includes(plan as PlanOption)) {
    throw badRequest('El campo planId debe ser: Plan Starter, Plan Pro o Plan Enterprise.');
  }

  return plan as PlanOption;
}

export function parseOptionalUserRole(value: unknown): 'admin' | 'usuario' | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== 'string') {
    throw badRequest('El campo rol debe ser texto con valor admin o usuario.');
  }

  const role = value.trim().toLowerCase();

  if (!USER_ROLES.includes(role as (typeof USER_ROLES)[number])) {
    throw badRequest('El campo rol debe ser admin o usuario.');
  }

  return role as 'admin' | 'usuario';
}

export function parseOptionalCustomerIdQuery(value: unknown): number | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== 'string' || value.trim().length === 0) {
    throw badRequest('El filtro customerId debe ser un entero válido.');
  }

  const customerId = Number(value);

  if (!Number.isInteger(customerId) || customerId <= 0) {
    throw badRequest('El filtro customerId debe ser un entero mayor que 0.');
  }

  return customerId;
}

export function parseIdParam(value: unknown, resourceName: string): number {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw badRequest(`El identificador de ${resourceName} es obligatorio.`);
  }

  const parsedValue = Number(value);

  if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
    throw badRequest(`El identificador de ${resourceName} debe ser un entero mayor que 0.`);
  }

  return parsedValue;
}
