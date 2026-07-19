import { Router } from 'express';

import {
  createUser,
  deleteUser,
  getUser,
  loginUser,
  listUsers,
  updateUser,
} from '../controllers/user.controller.js';

export const userRouter = Router();

userRouter.post('/login', loginUser);
userRouter.post('/', createUser);
userRouter.get('/', listUsers);
userRouter.get('/:id', getUser);
userRouter.put('/:id', updateUser);
userRouter.delete('/:id', deleteUser);
