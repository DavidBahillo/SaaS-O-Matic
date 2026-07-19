import cors from 'cors';
import express from 'express';
import type { NextFunction, Request, Response } from 'express';

import { ApiError, isApiError } from './errors.js';
import { countryRouter } from './routes/country.routes.js';
import { customerRouter } from './routes/customer.routes.js';
import { pricingTierRouter } from './routes/pricing-tier.routes.js';
import { simulationRouter } from './routes/simulation.routes.js';
import { taxRouter } from './routes/tax.routes.js';
import { userRouter } from './routes/user.routes.js';

export const app = express();

app.use(cors());
app.use(express.json());

app.use('/customers', customerRouter);
app.use('/countries', countryRouter);
app.use('/simulations', simulationRouter);
app.use('/impuestos', taxRouter);
app.use('/pricing-tiers', pricingTierRouter);
app.use('/users', userRouter);

app.use((_request, _response, next) => {
  next(new ApiError(404, 'NOT_FOUND', 'Ruta no encontrada.'));
});

app.use((error: unknown, _request: Request, response: Response, _next: NextFunction) => {
  if (isApiError(error)) {
    response.status(error.statusCode).json({ error: error.code, message: error.message });
    return;
  }

  const message = error instanceof Error ? error.message : 'Error interno del servidor.';
  response.status(500).json({ error: 'INTERNAL_SERVER_ERROR', message });
});
