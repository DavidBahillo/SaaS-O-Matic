import { all, get } from './database/sqlite.js';

interface PricingTierConfig {
  level: number;
  userLimit: number | null;
  pricePerUser: number;
}

interface PricingTierRow {
  level: number;
  user_limit: number | null;
  price_per_user: number;
}

const DEFAULT_PRICING_TIERS: PricingTierConfig[] = [
  { level: 1, userLimit: 10, pricePerUser: 10 },
  { level: 2, userLimit: 50, pricePerUser: 8 },
  { level: 3, userLimit: null, pricePerUser: 5 },
];
const DEFAULT_VAT_RATE = 0.21;

interface TaxRow {
  percentage: number;
}

function assertPositiveInteger(value: number, fieldName: string): void {
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`El campo ${fieldName} debe ser un entero mayor que 0.`);
  }
}

export function calculateTieredPrice(activeUsers: number): number {
  assertPositiveInteger(activeUsers, 'activeUsers');
  return calculateTieredPriceFromTiers(activeUsers, DEFAULT_PRICING_TIERS);
}

export async function calculateTieredPriceFromDatabase(activeUsers: number): Promise<number> {
  assertPositiveInteger(activeUsers, 'activeUsers');

  const tiers = await getPricingTiers();
  return calculateTieredPriceFromTiers(activeUsers, tiers);
}

function calculateTieredPriceFromTiers(activeUsers: number, tiers: readonly PricingTierConfig[]): number {
  assertTierConfiguration(tiers);

  let totalCost = 0;
  let previousLimit = 0;

  for (const tier of tiers) {
    if (activeUsers <= previousLimit) {
      break;
    }

    if (tier.userLimit === null) {
      const usersInTier = activeUsers - previousLimit;
      totalCost += usersInTier * tier.pricePerUser;
      return roundCurrency(totalCost);
    }

    const usersInTier = Math.min(activeUsers, tier.userLimit) - previousLimit;

    if (usersInTier > 0) {
      totalCost += usersInTier * tier.pricePerUser;
    }

    previousLimit = tier.userLimit;
  }

  return roundCurrency(totalCost);
}

function assertTierConfiguration(tiers: readonly PricingTierConfig[]): void {
  if (tiers.length === 0) {
    throw new Error('No hay tramos de precio configurados.');
  }

  const sortedTiers = [...tiers].sort((left, right) => left.level - right.level);
  const lastTier = sortedTiers.at(-1);

  if (lastTier === undefined) {
    throw new Error('No hay tramos de precio configurados.');
  }

  for (const [index, tier] of sortedTiers.entries()) {
    const isLast = index === sortedTiers.length - 1;
    const nextTier = sortedTiers[index + 1];

    if (tier.level <= 0 || !Number.isInteger(tier.level)) {
      throw new Error('Los niveles de tramos deben ser enteros mayores que 0.');
    }

    if (tier.pricePerUser < 0 || Number.isNaN(tier.pricePerUser)) {
      throw new Error('El precio por usuario debe ser mayor o igual que 0.');
    }

    if (tier.userLimit !== null && (!Number.isInteger(tier.userLimit) || tier.userLimit <= 0)) {
      throw new Error('El límite de usuarios debe ser entero mayor que 0 o nulo.');
    }

    if (!isLast && tier.userLimit === null) {
      throw new Error('Solo el último tramo puede tener límite nulo.');
    }

    if (nextTier !== undefined && tier.userLimit !== null && nextTier.userLimit !== null && tier.userLimit >= nextTier.userLimit) {
      throw new Error('Los límites de usuarios deben ser estrictamente crecientes.');
    }
  }

  if (lastTier.userLimit !== null) {
    throw new Error('El último tramo debe tener límite de usuarios nulo.');
  }
}

async function getPricingTiers(): Promise<PricingTierConfig[]> {
  const rows = await all<PricingTierRow>('SELECT level, user_limit, price_per_user FROM pricing_tiers ORDER BY level ASC;');

  if (rows.length === 0) {
    return DEFAULT_PRICING_TIERS;
  }

  return rows.map(row => ({
    level: row.level,
    userLimit: row.user_limit,
    pricePerUser: row.price_per_user,
  }));
}

export async function calculateTieredPriceWithVat(activeUsers: number, country: string): Promise<number> {
  const baseCost = await calculateTieredPriceFromDatabase(activeUsers);
  const vatRate = await getVatRateByCountry(country);

  return roundCurrency(baseCost * (1 + vatRate));
}

async function getVatRateByCountry(country: string): Promise<number> {
  const normalizedCountry = country.trim().toUpperCase();

  if (normalizedCountry.length === 0) {
    return DEFAULT_VAT_RATE;
  }

  const row = await get<TaxRow>(
    'SELECT percentage FROM impuestos WHERE country_name = ? LIMIT 1;',
    [normalizedCountry],
  );

  if (row === undefined || typeof row.percentage !== 'number' || Number.isNaN(row.percentage)) {
    return DEFAULT_VAT_RATE;
  }

  return row.percentage / 100;
}

export function roundCurrency(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}
