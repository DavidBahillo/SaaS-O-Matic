import { Router } from 'express';

import { listCountries } from '../controllers/country.controller.js';

export const countryRouter = Router();

countryRouter.get('/', listCountries);
