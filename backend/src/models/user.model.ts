export interface UserRow {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  contrasena: string;
  rol: UserRole;
  created_at: string;
}

export type UserRole = 'admin' | 'usuario';

export interface User {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: UserRole;
  createdAt: string;
}

export interface CreateUserInput {
  nombre: string;
  apellido: string;
  email: string;
  contrasena: string;
  rol: UserRole;
}

export interface UpdateUserInput {
  nombre: string;
  apellido: string;
  email: string;
  contrasena: string;
  rol: UserRole;
}
