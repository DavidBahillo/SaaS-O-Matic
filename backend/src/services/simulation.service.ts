import { badRequest, notFound } from '../errors.js';
import type {
  CreateSimulationInput,
  Simulation,
  SimulationFilters,
  UpdateSimulationInput,
} from '../models/index.js';
import { CustomerRepository } from '../repositories/customer.repository.js';
import { SimulationRepository } from '../repositories/simulation.repository.js';
import { calculateTieredPriceWithVat } from '../pricing.js';
import {
  parseNonNegativeInteger,
  parseNonNegativeNumber,
  parseOptionalCustomerIdQuery,
  parsePositiveInteger,
  parseString,
} from '../validation.js';

function assertPlainObject(value: unknown): asserts value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw badRequest('El cuerpo de la petición debe ser un objeto JSON válido.');
  }
}

function parseCurrency(value: unknown): string {
  if (value === undefined || value === null) {
    return 'EUR';
  }

  return parseString(value, 'currency').toUpperCase();
}

export class SimulationService {
  private readonly simulationRepository: SimulationRepository;

  private readonly customerRepository: CustomerRepository;

  public constructor(
    simulationRepository = new SimulationRepository(),
    customerRepository = new CustomerRepository(),
  ) {
    this.simulationRepository = simulationRepository;
    this.customerRepository = customerRepository;
  }

  public async createSimulation(payload: unknown): Promise<Simulation> {
    assertPlainObject(payload);

    const customerId = parsePositiveInteger(payload.customerId, 'customerId');
    const customer = await this.customerRepository.findById(customerId);

    if (customer === undefined) {
      throw notFound('Cliente no encontrado.');
    }

    const input: CreateSimulationInput = {
      customerId,
      budgetName: payload.budgetName !== undefined
        ? parseString(payload.budgetName, 'budgetName')
        : `Simulación #${customerId}`,
      activeUsers: parsePositiveInteger(payload.activeUsers, 'activeUsers'),
      storage: parseNonNegativeNumber(payload.storage, 'storage'),
      apiCalls: parseNonNegativeInteger(payload.apiCalls, 'apiCalls'),
      currency: parseCurrency(payload.currency),
    };

    const totalCost = await calculateTieredPriceWithVat(input.activeUsers, customer.country);
    return this.simulationRepository.create(input, totalCost);
  }

  public async listSimulations(query: unknown): Promise<Simulation[]> {
    if (typeof query !== 'object' || query === null || Array.isArray(query)) {
      throw badRequest('Los filtros de consulta no son válidos.');
    }

    const typedQuery = query as Record<string, unknown>;
    const customerId = parseOptionalCustomerIdQuery(typedQuery.customerId);

    const filters: SimulationFilters = {};

    if (customerId !== undefined) {
      filters.customerId = customerId;
    }

    return this.simulationRepository.list(filters);
  }

  public async getSimulation(id: number): Promise<Simulation> {
    const simulation = await this.simulationRepository.findById(id);

    if (simulation === undefined) {
      throw notFound('Simulación no encontrada.');
    }

    return simulation;
  }

  public async updateSimulation(id: number, payload: unknown): Promise<Simulation> {
    assertPlainObject(payload);

    const existingSimulation = await this.getSimulation(id);

    const input: UpdateSimulationInput = {
      budgetName:
        payload.budgetName === undefined
          ? existingSimulation.budgetName
          : parseString(payload.budgetName, 'budgetName'),
      activeUsers:
        payload.activeUsers === undefined
          ? existingSimulation.activeUsers
          : parsePositiveInteger(payload.activeUsers, 'activeUsers'),
      storage:
        payload.storage === undefined
          ? existingSimulation.storage
          : parseNonNegativeNumber(payload.storage, 'storage'),
      apiCalls:
        payload.apiCalls === undefined
          ? existingSimulation.apiCalls
          : parseNonNegativeInteger(payload.apiCalls, 'apiCalls'),
      currency:
        payload.currency === undefined
          ? existingSimulation.currency
          : parseCurrency(payload.currency),
    };

    const customer = await this.customerRepository.findById(existingSimulation.customerId);

    if (customer === undefined) {
      throw notFound('Cliente no encontrado.');
    }

    const totalCost = await calculateTieredPriceWithVat(input.activeUsers, customer.country);
    const updatedSimulation = await this.simulationRepository.update(id, input, totalCost);

    if (updatedSimulation === undefined) {
      throw notFound('Simulación no encontrada.');
    }

    return updatedSimulation;
  }

  public async deleteSimulation(id: number): Promise<void> {
    const deleted = await this.simulationRepository.delete(id);

    if (!deleted) {
      throw notFound('Simulación no encontrada.');
    }
  }
}
