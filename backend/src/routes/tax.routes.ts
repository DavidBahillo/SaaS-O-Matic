import { Router } from 'express';

import {
  createTax,
  deleteTax,
  getTax,
  listTaxes,
  updateTax,
} from '../controllers/tax.controller.js';

export const taxRouter = Router();

taxRouter.post('/', createTax);
taxRouter.get('/', listTaxes);
taxRouter.get('/:id', getTax);
taxRouter.put('/:id', updateTax);
taxRouter.delete('/:id', deleteTax);
