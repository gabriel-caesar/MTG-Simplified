import 'dotenv/config';

import { Db, MongoClient, ServerApiVersion } from 'mongodb';

const uri: string | undefined = process.env.MONGO_URI;

let client: MongoClient; // MongoDB client
let db: Db; // Actual database instance

export async function connectToDb(): Promise<Db> {

  if (!uri) throw new Error('Database URI not accessible');

  if (db) return db;

  client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  await client.connect();
  db = client.db('mtg');

  return db;
}

export async function getDb(): Promise<Db> {
  if (!db) {
    // If any db instance was returned from getDb(), connect to it from scratch
    db = await connectToDb();
    if (!db) throw new Error('Database could not be initialized.');
  }
  return db;
}
