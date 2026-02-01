import type { ObjectId } from 'mongodb';

export type ValidationReturn = { email: string, password: string }
export type ValidationError = { errors: string[] }
export type ValidationFormData = { confirm_password?: string } & ValidationReturn;

export type User = {
  _id: ObjectId,
  username: string,
  email: string,
  password: string,
  avatar: string
}