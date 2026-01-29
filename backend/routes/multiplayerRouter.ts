import { logInController, signUpController } from '../controllers/multiplayerController.ts';
import { Router } from 'express';

export const multiplayerRouter = Router();

multiplayerRouter.post('/signup', signUpController);
multiplayerRouter.post('/login', logInController);