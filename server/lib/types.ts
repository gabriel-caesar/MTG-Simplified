import type { ObjectId } from 'mongodb';

export type ValidationReturn = { email: string, password: string }
export type ValidationError = { errors: string[] }
export type ValidationFormData = { confirm_password?: string } & ValidationReturn;

export type Deck = {
  _id?: ObjectId,
  lands: { type: string, quantity: number }[],
  creatures: { name: string, quantity: number, ability: string }[],
  spells: { name: string, quantity: number, ability: string }[],
  name: string
}

export type User = {
  _id?: ObjectId,
  username: string,
  email: string,
  password: string,
  avatar: string,
  friends: User[],
  friend_invites: FriendInvite[],
  deck_id: ObjectId
}

export type FriendInvite = {
  recipient: string,
  sender: string,
  to: ObjectId,
  from: ObjectId,
  status: 0 | 1 | 2 // 0 → Declined; 1 → Accepted; 2 → Pending.
}

export type SocketMessage = {
  to: string,
  from: string,
  type: string,
  content?: string,
}