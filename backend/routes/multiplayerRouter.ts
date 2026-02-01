import { checkAuthController, logOutController, signUpController } from '../controllers/multiplayerController.ts';
import { authenticationMiddleware, validationMiddleware } from '../middlewares/middlewares.ts';
import { Router } from 'express';

export const multiplayerRouter = Router();

// Controls the sign up logic flow
multiplayerRouter.post('/signup', signUpController);

// Controls the user authentication flow with passport
multiplayerRouter.post('/login', validationMiddleware, authenticationMiddleware);

// Checks if the user is authenticated
multiplayerRouter.get('/auth', checkAuthController)

// Logs user out
multiplayerRouter.get('/logout', logOutController)