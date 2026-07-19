import type { NextFunction, Request, Response } from 'express';

import { PricingTierService } from '../services/pricing-tier.service.js';
import { parseIdParam } from '../validation.js';

const pricingTierService = new PricingTierService();

export async function createPricingTier(request: Request, response: Response, next: NextFunction): Promise<void> {
  try {
    const tier = await pricingTierService.createPricingTier(request.body);
    response.status(201).json(tier);
  } catch (error) {
    next(error);
  }
}

export async function listPricingTiers(_request: Request, response: Response, next: NextFunction): Promise<void> {
  try {
    const tiers = await pricingTierService.listPricingTiers();
    response.status(200).json(tiers);
  } catch (error) {
    next(error);
  }
}

export async function getPricingTier(request: Request, response: Response, next: NextFunction): Promise<void> {
  try {
    const tierId = parseIdParam(request.params.id, 'tramo de precio');
    const tier = await pricingTierService.getPricingTier(tierId);
    response.status(200).json(tier);
  } catch (error) {
    next(error);
  }
}

export async function updatePricingTier(request: Request, response: Response, next: NextFunction): Promise<void> {
  try {
    const tierId = parseIdParam(request.params.id, 'tramo de precio');
    const tier = await pricingTierService.updatePricingTier(tierId, request.body);
    response.status(200).json(tier);
  } catch (error) {
    next(error);
  }
}

export async function deletePricingTier(request: Request, response: Response, next: NextFunction): Promise<void> {
  try {
    const tierId = parseIdParam(request.params.id, 'tramo de precio');
    await pricingTierService.deletePricingTier(tierId);
    response.sendStatus(204);
  } catch (error) {
    next(error);
  }
}

export async function replacePricingTiers(request: Request, response: Response, next: NextFunction): Promise<void> {
  try {
    const tiers = await pricingTierService.replacePricingTiers(request.body);
    response.status(200).json(tiers);
  } catch (error) {
    next(error);
  }
}
