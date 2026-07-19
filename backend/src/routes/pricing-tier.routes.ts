import { Router } from 'express';

import {
  createPricingTier,
  deletePricingTier,
  getPricingTier,
  listPricingTiers,
  replacePricingTiers,
  updatePricingTier,
} from '../controllers/pricing-tier.controller.js';

export const pricingTierRouter = Router();

pricingTierRouter.post('/', createPricingTier);
pricingTierRouter.get('/', listPricingTiers);
pricingTierRouter.put('/', replacePricingTiers);
pricingTierRouter.get('/:id', getPricingTier);
pricingTierRouter.put('/:id', updatePricingTier);
pricingTierRouter.delete('/:id', deletePricingTier);
