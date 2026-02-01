import passport from 'passport'

import { Strategy as LocalStrategy } from 'passport-local';
import { ObjectId } from 'mongodb';
import { compare } from 'bcryptjs';
import { getDb } from './db.ts';

import type { User } from './lib/types.ts';

// ### Strategy Configuration ###

const customFields = {
  // → tells passport to understand that `username === email` in the verifyCallback() function
  usernameField: 'email',
  passwordField: 'password',
};

// Function clarification: function done(err: Error, user: User, info: { errors: string[] })

// Callback functino that runs when passport.authenticate executes
const verifyCallback = async (username: string, password: string, done: any): Promise<void> => {
  // Getting the database instance
  const db = await getDb();
  if (!db) throw new Error(`Couldn't get database from passport.ts.`);

  const user = await db.collection('users').findOne({ email: username })

  try {
    if (!user) {
      return done(null, false, { errors: ['Invalid credentials'] });
    }

    const isValid = await compare(password, user.password);
    if (!isValid) {
      return done(null, false, { errors: ['Invalid credentials'] });
    }

    return done(null, user);
  } catch (error) {
    return done(error);
  }
};

const strategy = new LocalStrategy(customFields, verifyCallback);

passport.use(strategy);

// Creates the connect.sid cookie
passport.serializeUser((user, done): void => {
  // serializes the user id into the user's session cookie
  done(null, (user as User)._id.toString());
});

// get user from the session
passport.deserializeUser(async (userId: string, done: any): Promise<void> => {
  // Getting the database instance
  const db = await getDb();
  if (!db) throw new Error(`Couldn't get database from passport.ts.`);

  // this function uses the user id provided by serializeUser() to attach the user object
  // into the request object of all middlewares being executed in the current session
  try {
    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) })
    done(null, user);
  } catch (error) {
    done(error);
  }
});