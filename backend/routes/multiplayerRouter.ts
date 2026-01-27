import { logIn, signUp } from '../controllers/multiplayerController.ts';
import { Router } from 'express';

export const multiplayerRouter = Router();

multiplayerRouter.post('/signup', signUp);
multiplayerRouter.post('/login', logIn);