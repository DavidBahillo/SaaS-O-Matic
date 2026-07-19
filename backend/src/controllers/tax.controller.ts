import type { NextFunction, Request, Response } from 'express';

import { TaxService } from '../services/tax.service.js';
import { parseIdParam } from '../validation.js';

const taxService = new TaxService();

export async function createTax(request: Request, response: Response, next: NextFunction): Promise<void> {
  try {
    const tax = await taxService.createTax(request.body);
    response.status(201).json(tax);
  } catch (error) {
    next(error);
  }
}

export async function listTaxes(_request: Request, response: Response, next: NextFunction): Promise<void> {
  try {
    const taxes = await taxService.listTaxes();
    response.status(200).json(taxes);
  } catch (error) {
    next(error);
  }
}

export async function getTax(request: Request, response: Response, next: NextFunction): Promise<void> {
  try {
    const taxId = parseIdParam(request.params.id, 'impuesto');
    const tax = await taxService.getTax(taxId);
    response.status(200).json(tax);
  } catch (error) {
    next(error);
  }
}

export async function updateTax(request: Request, response: Response, next: NextFunction): Promise<void> {
  try {
    const taxId = parseIdParam(request.params.id, 'impuesto');
    const tax = await taxService.updateTax(taxId, request.body);
    response.status(200).json(tax);
  } catch (error) {
    next(error);
  }
}

export async function deleteTax(request: Request, response: Response, next: NextFunction): Promise<void> {
  try {
    const taxId = parseIdParam(request.params.id, 'impuesto');
    await taxService.deleteTax(taxId);
    response.sendStatus(204);
  } catch (error) {
    next(error);
  }
}
