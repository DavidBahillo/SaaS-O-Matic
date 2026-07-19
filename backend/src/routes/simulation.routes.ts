import { Router } from 'express';

import {
  createSimulation,
  deleteSimulation,
  getSimulation,
  listSimulations,
  updateSimulation,
} from '../controllers/simulation.controller.js';

export const simulationRouter = Router();

simulationRouter.post('/', createSimulation);
simulationRouter.get('/', listSimulations);
simulationRouter.get('/:id', getSimulation);
simulationRouter.put('/:id', updateSimulation);
simulationRouter.delete('/:id', deleteSimulation);
