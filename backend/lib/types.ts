export type ValidationReturn = { email: string, password: string }
export type ValidationError = { errors: string[] }
export type ValidationFormData = { confirm_password?: string } & ValidationReturn;