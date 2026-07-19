import type { NextFunction, Request, Response } from 'express';

import { SimulationService } from '../services/simulation.service.js';
import { parseIdParam } from '../validation.js';

const simulationService = new SimulationService();

export async function createSimulation(request: Request, response: Response, next: NextFunction): Promise<void> {
  try {
    const simulation = await simulationService.createSimulation(request.body);
    response.status(201).json(simulation);
  } catch (error) {
    next(error);
  }
}

export async function listSimulations(request: Request, response: Response, next: NextFunction): Promise<void> {
  try {
    const simulations = await simulationService.listSimulations(request.query);
    response.status(200).json(simulations);
  } catch (error) {
    next(error);
  }
}

export async function getSimulation(request: Request, response: Response, next: NextFunction): Promise<void> {
  try {
    const simulationId = parseIdParam(request.params.id, 'simulación');
    const simulation = await simulationService.getSimulation(simulationId);
    response.status(200).json(simulation);
  } catch (error) {
    next(error);
  }
}

export async function updateSimulation(request: Request, response: Response, next: NextFunction): Promise<void> {
  try {
    const simulationId = parseIdParam(request.params.id, 'simulación');
    const simulation = await simulationService.updateSimulation(simulationId, request.body);
    response.status(200).json(simulation);
  } catch (error) {
    next(error);
  }
}

export async function deleteSimulation(request: Request, response: Response, next: NextFunction): Promise<void> {
  try {
    const simulationId = parseIdParam(request.params.id, 'simulación');
    await simulationService.deleteSimulation(simulationId);
    response.sendStatus(204);
  } catch (error) {
    next(error);
  }
}
