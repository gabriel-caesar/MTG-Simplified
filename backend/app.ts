import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';
import dns from "node:dns/promises";

dns.setServers(["1.1.1.1"]); // Fix the error when connecting to MongoDB

import { multiplayerRouter } from './routes/multiplayerRouter.ts';
import { connectToDb } from './db.ts';

const app = express();
const corsOptions = {
  origin: ['http://localhost:5173'],
};

// Configuring the server to listen to the React front-end
app.use(cors(corsOptions));
// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded());
// Parse application/json
app.use(bodyParser.json());

// Creates the /multplayer route
app.use('/multiplayer', multiplayerRouter);

// Connects to MongoDB
await connectToDb();

const PORT = 8080
app.listen(PORT, (err: unknown) => {
  if (err) throw new Error(`Couldng't start server. ${err}`);
  console.log(`Running the backend, app listening in localhost:${PORT}`);
});

// Middleware never returns data.
// Middleware communicates only through side effects (res.something()). 