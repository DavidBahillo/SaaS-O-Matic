import { CustomerRepository } from '../repositories/customer.repository.js';
import { SimulationRepository } from '../repositories/simulation.repository.js';
import type {
  CreateCustomerInput,
  Customer,
  CustomerWithSimulations,
  SimulationFilters,
  UpdateCustomerInput,
} from '../models/index.js';
import {
  parseCountry,
  parseEmail,
  parseOptionalPlan,
  parseOptionalTaxIdForCountry,
  parseString,
} from '../validation.js';
import { badRequest, notFound } from '../errors.js';

function assertPlainObject(value: unknown): asserts value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw badRequest('El cuerpo de la petición debe ser un objeto JSON válido.');
  }
}

export class CustomerService {
  private readonly customerRepository: CustomerRepository;

  private readonly simulationRepository: SimulationRepository;

  public constructor(
    customerRepository = new CustomerRepository(),
    simulationRepository = new SimulationRepository(),
  ) {
    this.customerRepository = customerRepository;
    this.simulationRepository = simulationRepository;
  }

  public async createCustomer(payload: unknown): Promise<Customer> {
    assertPlainObject(payload);

    const country = parseCountry(payload.country);

    const input: CreateCustomerInput = {
      companyName: parseString(payload.companyName, 'companyName'),
      taxId: parseOptionalTaxIdForCountry(country, payload.taxId),
      contactEmail: parseEmail(payload.contactEmail, 'contactEmail'),
      country,
      planId: parseOptionalPlan(payload.planId),
    };

    return this.customerRepository.create(input);
  }

  public async listCustomers(): Promise<Customer[]> {
    return this.customerRepository.list();
  }

  public async getCustomer(id: number): Promise<Customer> {
    const customer = await this.customerRepository.findById(id);

    if (customer === undefined) {
      throw notFound('Cliente no encontrado.');
    }

    return customer;
  }

  public async getCustomerWithSimulations(id: number): Promise<CustomerWithSimulations> {
    const customer = await this.getCustomer(id);
    const simulationFilters: SimulationFilters = { customerId: id };
    const simulations = await this.simulationRepository.list(simulationFilters);

    return {
      customer,
      simulations,
    };
  }

  public async updateCustomer(id: number, payload: unknown): Promise<Customer> {
    assertPlainObject(payload);

    const existingCustomer = await this.getCustomer(id);
    const country = payload.country === undefined ? existingCustomer.country : parseCountry(payload.country);

    const input: UpdateCustomerInput = {
      companyName:
        payload.companyName === undefined
          ? existingCustomer.companyName
          : parseString(payload.companyName, 'companyName'),
      taxId:
        payload.taxId === undefined
          ? parseOptionalTaxIdForCountry(country, existingCustomer.taxId)
          : parseOptionalTaxIdForCountry(country, payload.taxId),
      contactEmail:
        payload.contactEmail === undefined
          ? existingCustomer.contactEmail
          : parseEmail(payload.contactEmail, 'contactEmail'),
      country,
      planId:
        payload.planId === undefined
          ? existingCustomer.planId
          : parseOptionalPlan(payload.planId),
    };

    const updatedCustomer = await this.customerRepository.update(id, input);

    if (updatedCustomer === undefined) {
      throw notFound('Cliente no encontrado.');
    }

    return updatedCustomer;
  }

  public async deleteCustomer(id: number): Promise<void> {
    const deleted = await this.customerRepository.delete(id);

    if (!deleted) {
      throw notFound('Cliente no encontrado.');
    }
  }
}
