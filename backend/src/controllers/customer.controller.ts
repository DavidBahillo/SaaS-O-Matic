import type { NextFunction, Request, Response } from 'express';

import { CustomerService } from '../services/customer.service.js';
import { parseIdParam } from '../validation.js';

const customerService = new CustomerService();

export async function createCustomer(request: Request, response: Response, next: NextFunction): Promise<void> {
  try {
    const customer = await customerService.createCustomer(request.body);
    response.status(201).json(customer);
  } catch (error) {
    next(error);
  }
}

export async function listCustomers(_request: Request, response: Response, next: NextFunction): Promise<void> {
  try {
    const customers = await customerService.listCustomers();
    response.status(200).json(customers);
  } catch (error) {
    next(error);
  }
}

export async function getCustomer(request: Request, response: Response, next: NextFunction): Promise<void> {
  try {
    const customerId = parseIdParam(request.params.id, 'cliente');
    const customer = await customerService.getCustomer(customerId);
    response.status(200).json(customer);
  } catch (error) {
    next(error);
  }
}

export async function getCustomerWithSimulations(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const customerId = parseIdParam(request.params.id, 'cliente');
    const customerWithSimulations = await customerService.getCustomerWithSimulations(customerId);
    response.status(200).json(customerWithSimulations);
  } catch (error) {
    next(error);
  }
}

export async function updateCustomer(request: Request, response: Response, next: NextFunction): Promise<void> {
  try {
    const customerId = parseIdParam(request.params.id, 'cliente');
    const customer = await customerService.updateCustomer(customerId, request.body);
    response.status(200).json(customer);
  } catch (error) {
    next(error);
  }
}

export async function deleteCustomer(request: Request, response: Response, next: NextFunction): Promise<void> {
  try {
    const customerId = parseIdParam(request.params.id, 'cliente');
    await customerService.deleteCustomer(customerId);
    response.sendStatus(204);
  } catch (error) {
    next(error);
  }
}
