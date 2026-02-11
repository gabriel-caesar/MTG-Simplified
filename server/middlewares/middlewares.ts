import passport from 'passport';

import { formValidation } from '../lib/utils.ts';
import { LogInSchema } from '../lib/schemas.ts';

import type { NextFunction, Request, Response } from 'express';
import type { User } from '../lib/types.ts';

export function authenticationMiddleware (req: Request, res: Response, next: NextFunction) {
  passport.authenticate('local', (err: Error, user: User, info: { errors: string[] }) => {
    // Handling errors passed from the verifyCallback and that will
    // be displayed by the client
    if (err) return next(err);
    if (!user) return res.status(401).json(info); // Returns an error response if the user couldn't log in
    
    // Triggers serialization (passport.serializeUser()) and creates the session
    req.logIn(user, (err) => {
      if (err) return next(err);
      res.status(200).json({ success: true, user: user }); // Returns a successful response if the user logged in
    });
  })(req, res, next); // IIFE (Immediately Invoked Function Expression)
}

// Middleware function that validates the log in 
// input before handling the control to passport.authenticate
export function validationMiddleware(req: Request, res: Response, next: NextFunction) {
  const validationResult = formValidation(LogInSchema, req.body);
  
  // If validation failed
  if ('errors' in validationResult) {
    res.status(400).json(validationResult)
    return
  }

  next();
}