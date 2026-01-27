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

export function getDb(): Db {
  if (!db) {
    throw new Error('Database not initialized. Call connectToDb first.');
  }
  return db;
}
