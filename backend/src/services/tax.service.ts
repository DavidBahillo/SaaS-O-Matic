import { conflict, notFound, badRequest } from '../errors.js';
import type { CreateTaxInput, TaxEntity, UpdateTaxInput } from '../models/index.js';
import { TaxRepository } from '../repositories/tax.repository.js';
import { parseCountry, parsePercentage, parseString } from '../validation.js';

function assertPlainObject(value: unknown): asserts value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw badRequest('El cuerpo de la petición debe ser un objeto JSON válido.');
  }
}

export class TaxService {
  private readonly taxRepository: TaxRepository;

  public constructor(taxRepository = new TaxRepository()) {
    this.taxRepository = taxRepository;
  }

  public async createTax(payload: unknown): Promise<TaxEntity> {
    assertPlainObject(payload);

    const input: CreateTaxInput = {
      countryName: parseCountry(payload.countryName, 'countryName'),
      taxName: parseString(payload.taxName, 'taxName'),
      percentage: parsePercentage(payload.percentage, 'percentage'),
    };

    const existingTax = await this.taxRepository.findByCountryName(input.countryName);

    if (existingTax !== undefined) {
      throw conflict('Ya existe un impuesto configurado para ese país.');
    }

    return this.taxRepository.create(input);
  }

  public async listTaxes(): Promise<TaxEntity[]> {
    return this.taxRepository.list();
  }

  public async getTax(id: number): Promise<TaxEntity> {
    const tax = await this.taxRepository.findById(id);

    if (tax === undefined) {
      throw notFound('Impuesto no encontrado.');
    }

    return tax;
  }

  public async updateTax(id: number, payload: unknown): Promise<TaxEntity> {
    assertPlainObject(payload);

    const existingTax = await this.getTax(id);

    const input: UpdateTaxInput = {
      countryName:
        payload.countryName === undefined
          ? existingTax.countryName
          : parseCountry(payload.countryName, 'countryName'),
      taxName: payload.taxName === undefined ? existingTax.taxName : parseString(payload.taxName, 'taxName'),
      percentage:
        payload.percentage === undefined
          ? existingTax.percentage
          : parsePercentage(payload.percentage, 'percentage'),
    };

    const taxWithCountry = await this.taxRepository.findByCountryName(input.countryName);

    if (taxWithCountry !== undefined && taxWithCountry.id !== id) {
      throw conflict('Ya existe un impuesto configurado para ese país.');
    }

    const updatedTax = await this.taxRepository.update(id, input);

    if (updatedTax === undefined) {
      throw notFound('Impuesto no encontrado.');
    }

    return updatedTax;
  }

  public async deleteTax(id: number): Promise<void> {
    const deleted = await this.taxRepository.delete(id);

    if (!deleted) {
      throw notFound('Impuesto no encontrado.');
    }
  }
}
