import { Router } from 'express';

import {
  createCustomer,
  deleteCustomer,
  getCustomer,
  getCustomerWithSimulations,
  listCustomers,
  updateCustomer,
} from '../controllers/customer.controller.js';

export const customerRouter = Router();

customerRouter.post('/', createCustomer);
customerRouter.get('/', listCustomers);
customerRouter.get('/:id/full', getCustomerWithSimulations);
customerRouter.get('/:id', getCustomer);
customerRouter.put('/:id', updateCustomer);
customerRouter.delete('/:id', deleteCustomer);
