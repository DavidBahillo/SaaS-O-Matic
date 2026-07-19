import type { NextFunction, Request, Response } from 'express';

import { COUNTRY_OPTIONS } from '../countryOptions.js';

export function listCountries(_request: Request, response: Response, _next: NextFunction): void {
  response.status(200).json(COUNTRY_OPTIONS);
}
