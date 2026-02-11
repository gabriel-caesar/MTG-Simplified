import 'dotenv/config';

import express, { type NextFunction, type Request, type Response } from 'express';
import MongoStore from 'connect-mongo';
import bodyParser from 'body-parser';
import passport from 'passport';
import session from 'express-session';
import cors from 'cors';
import dns from "node:dns/promises";

dns.setServers(["1.1.1.1"]); // Fix the error when connecting to MongoDB

import { multiplayerRouter } from './routes/multiplayerRouter.ts';
import { connectToDb } from './db.ts';

const app = express();
const corsOptions = {
  origin: ['http://localhost:5173'], // Enables the client to communicate with this backend service
  credentials: true // Enables the client to receive the session cookie
};

// Configuring the server to listen to the React front-end
app.use(cors(corsOptions));
// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded());
// Parse application/json
app.use(bodyParser.json());
// Connects to MongoDB
const db = await connectToDb();
// Creates a MongoDB storage for sessions
const sessionStore = MongoStore.create({ client: db.client, dbName: 'mtg', collectionName: 'sessions' });
// Ensuring that the session secret was imported successfully
if (!process.env.SESSION_SECRET) throw new Error(`Session secret wasn't loaded properly. Import session secret.`);

// Sets up the session config into the app variable (main Express router)
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));

// Enables passport to use sessions and retrieve the user cookie in every request object
app.use(passport.initialize());
app.use(passport.session());

// Imports the passport configuration setup
import './passport.ts';

// Creates the /multiplayer route
app.use('/multiplayer', multiplayerRouter);

// Last resort error handler function
function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  console.log(`\n# ATTENTION #\nCatch all error handler reached\n${err}\n`);
  res.status(500).json({ error: 'Internal server error: last resort error handler reached.' });
};

app.get('/multiplayer/login', (req, res) => {
  res.send('Session logged');
})

app.use(errorHandler);

const PORT = 8080
app.listen(PORT, (err: unknown) => {
  if (err) throw new Error(`Couldng't start server. ${err}`);
  console.log(`Running the backend, app listening in localhost:${PORT}`);
});

// Middleware never returns data.
// Middleware communicates only through side effects (res.something()). 