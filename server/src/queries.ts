import { getDb } from './db.ts';

import type { User } from '../lib/types.ts';
import type { Filter } from 'mongodb';

export async function getUser(queryFilter: Filter<User>): Promise<User | null> {
  const db = await getDb();
  const usersCollection = db.collection<User>('users');
  const user = await usersCollection.findOne(queryFilter)
  return user
}