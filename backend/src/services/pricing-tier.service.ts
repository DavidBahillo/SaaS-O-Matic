import { badRequest, conflict, notFound } from '../errors.js';
import type {
  CreatePricingTierInput,
  PricingTier,
  PricingTierConfig,
  UpdatePricingTierInput,
} from '../models/index.js';
import { PricingTierRepository } from '../repositories/pricing-tier.repository.js';
import { parseNonNegativeNumber, parsePositiveInteger } from '../validation.js';

function assertPlainObject(value: unknown): asserts value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw badRequest('El cuerpo de la petición debe ser un objeto JSON válido.');
  }
}

function parseUserLimit(value: unknown): number | null {
  if (value === undefined || value === null) {
    return null;
  }

  if (typeof value !== 'number' || !Number.isInteger(value) || value <= 0) {
    throw badRequest('El campo userLimit debe ser un entero mayor que 0 o nulo.');
  }

  return value;
}

function validateTierStructure(tiers: readonly PricingTierConfig[]): void {
  if (tiers.length === 0) {
    throw badRequest('Debe existir al menos un tramo de precio.');
  }

  const sortedTiers = [...tiers].sort((left, right) => left.level - right.level);

  for (let index = 0; index < sortedTiers.length; index += 1) {
    const tier = sortedTiers[index];
    if (tier === undefined) continue;
    const isLast = index === sortedTiers.length - 1;
    const nextTier = sortedTiers[index + 1];

    if (!isLast && tier.userLimit === null) {
      throw badRequest('Solo el último tramo puede tener userLimit nulo.');
    }

    if (isLast && tier.userLimit !== null) {
      throw badRequest('El último tramo debe tener userLimit nulo.');
    }

    if (nextTier !== undefined && tier.userLimit !== null && nextTier.userLimit !== null && tier.userLimit >= nextTier.userLimit) {
      throw badRequest('Los userLimit deben ser estrictamente crecientes.');
    }
  }
}

function toTierConfig(tier: PricingTier): PricingTierConfig {
  return {
    level: tier.level,
    userLimit: tier.userLimit,
    pricePerUser: tier.pricePerUser,
  };
}

export class PricingTierService {
  private readonly pricingTierRepository: PricingTierRepository;

  public constructor(pricingTierRepository = new PricingTierRepository()) {
    this.pricingTierRepository = pricingTierRepository;
  }

  public async createPricingTier(payload: unknown): Promise<PricingTier> {
    assertPlainObject(payload);

    const input: CreatePricingTierInput = {
      level: parsePositiveInteger(payload.level, 'level'),
      userLimit: parseUserLimit(payload.userLimit),
      pricePerUser: parseNonNegativeNumber(payload.pricePerUser, 'pricePerUser'),
    };

    const tierAtLevel = await this.pricingTierRepository.findByLevel(input.level);

    if (tierAtLevel !== undefined) {
      throw conflict('Ya existe un tramo con ese nivel.');
    }

    const existingTiers = await this.pricingTierRepository.list();
    validateTierStructure([...existingTiers.map(toTierConfig), input]);

    return this.pricingTierRepository.create(input);
  }

  public async listPricingTiers(): Promise<PricingTier[]> {
    return this.pricingTierRepository.list();
  }

  public async getPricingTier(id: number): Promise<PricingTier> {
    const tier = await this.pricingTierRepository.findById(id);

    if (tier === undefined) {
      throw notFound('Tramo de precio no encontrado.');
    }

    return tier;
  }

  public async updatePricingTier(id: number, payload: unknown): Promise<PricingTier> {
    assertPlainObject(payload);

    const existingTier = await this.getPricingTier(id);

    const input: UpdatePricingTierInput = {
      level: payload.level === undefined ? existingTier.level : parsePositiveInteger(payload.level, 'level'),
      userLimit: payload.userLimit === undefined ? existingTier.userLimit : parseUserLimit(payload.userLimit),
      pricePerUser:
        payload.pricePerUser === undefined
          ? existingTier.pricePerUser
          : parseNonNegativeNumber(payload.pricePerUser, 'pricePerUser'),
    };

    const tierAtLevel = await this.pricingTierRepository.findByLevel(input.level);

    if (tierAtLevel !== undefined && tierAtLevel.id !== id) {
      throw conflict('Ya existe un tramo con ese nivel.');
    }

    const tiers = await this.pricingTierRepository.list();
    const updatedStructure = tiers.map(tier => (tier.id === id ? input : toTierConfig(tier)));
    validateTierStructure(updatedStructure);

    const updatedTier = await this.pricingTierRepository.update(id, input);

    if (updatedTier === undefined) {
      throw notFound('Tramo de precio no encontrado.');
    }

    return updatedTier;
  }

  public async deletePricingTier(id: number): Promise<void> {
    const tiers = await this.pricingTierRepository.list();
    const remaining = tiers.filter(tier => tier.id !== id);

    if (remaining.length === tiers.length) {
      throw notFound('Tramo de precio no encontrado.');
    }

    validateTierStructure(remaining.map(toTierConfig));

    const deleted = await this.pricingTierRepository.delete(id);

    if (!deleted) {
      throw notFound('Tramo de precio no encontrado.');
    }
  }

  public async replacePricingTiers(payload: unknown): Promise<PricingTier[]> {
    if (!Array.isArray(payload)) {
      throw badRequest('El cuerpo de la petición debe ser un array de tramos.');
    }

    if (payload.length === 0) {
      throw badRequest('Debe existir al menos un tramo de precio.');
    }

    const parsedTiers: PricingTierConfig[] = payload.map((item, index) => {
      assertPlainObject(item);

      return {
        level: parsePositiveInteger(item.level, `tiers[${index}].level`),
        userLimit: parseUserLimit(item.userLimit),
        pricePerUser: parseNonNegativeNumber(item.pricePerUser, `tiers[${index}].pricePerUser`),
      };
    });

    const levelSet = new Set(parsedTiers.map(tier => tier.level));
    if (levelSet.size !== parsedTiers.length) {
      throw badRequest('Los niveles de tramos no pueden repetirse.');
    }

    validateTierStructure(parsedTiers);
    return this.pricingTierRepository.replaceAll(parsedTiers);
  }
}
