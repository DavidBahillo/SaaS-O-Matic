import type { NextFunction, Request, Response } from 'express';

import { UserService } from '../services/user.service.js';
import { parseIdParam } from '../validation.js';

const userService = new UserService();

export async function createUser(request: Request, response: Response, next: NextFunction): Promise<void> {
  try {
    const actorHeader = request.header('x-user-id');
    const actorUserId = parseIdParam(actorHeader, 'usuario autenticado');
    response.status(201).json(await userService.createUserAsActor(actorUserId, request.body));
  } catch (error) {
    next(error);
  }
}

export async function listUsers(_request: Request, response: Response, next: NextFunction): Promise<void> {
  try {
    const users = await userService.listUsers();
    response.status(200).json(users);
  } catch (error) {
    next(error);
  }
}

export async function loginUser(request: Request, response: Response, next: NextFunction): Promise<void> {
  try {
    response.status(200).json(await userService.login(request.body));
  } catch (error) {
    next(error);
  }
}

export async function getUser(request: Request, response: Response, next: NextFunction): Promise<void> {
  try {
    const userId = parseIdParam(request.params.id, 'usuario');
    response.status(200).json(await userService.getUser(userId));
  } catch (error) {
    next(error);
  }
}

export async function updateUser(request: Request, response: Response, next: NextFunction): Promise<void> {
  try {
    const userId = parseIdParam(request.params.id, 'usuario');
    response.status(200).json(await userService.updateUser(userId, request.body));
  } catch (error) {
    next(error);
  }
}

export async function deleteUser(request: Request, response: Response, next: NextFunction): Promise<void> {
  try {
    const userId = parseIdParam(request.params.id, 'usuario');
    await userService.deleteUser(userId);
    response.sendStatus(204);
  } catch (error) {
    next(error);
  }
}
