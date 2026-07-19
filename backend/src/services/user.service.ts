import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

import { badRequest, conflict, forbidden, notFound, unauthorized } from '../errors.js';
import type {
  CreateUserInput,
  UpdateUserInput,
  User,
} from '../models/index.js';
import { UserRepository } from '../repositories/user.repository.js';
import { parseEmail, parseOptionalUserRole, parseString } from '../validation.js';

const scryptAsync = promisify(scryptCallback);

function assertPlainObject(value: unknown): asserts value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw badRequest('El cuerpo de la peticion debe ser un objeto JSON valido.');
  }
}

function parsePassword(value: unknown): string {
  const password = parseString(value, 'contrasena');

  if (password.length < 8) {
    throw badRequest('El campo contrasena debe tener al menos 8 caracteres.');
  }

  return password;
}

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${salt}:${derivedKey.toString('hex')}`;
}

async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const [salt, storedKeyHex] = storedHash.split(':');

  if (salt === undefined || storedKeyHex === undefined) {
    return false;
  }

  const storedKey = Buffer.from(storedKeyHex, 'hex');
  const derivedKey = (await scryptAsync(password, salt, storedKey.length)) as Buffer;

  if (storedKey.length !== derivedKey.length) {
    return false;
  }

  return timingSafeEqual(storedKey, derivedKey);
}

export class UserService {
  private readonly userRepository: UserRepository;

  public constructor(userRepository = new UserRepository()) {
    this.userRepository = userRepository;
  }

  public async createUserAsActor(actorUserId: number, payload: unknown): Promise<User> {
    assertPlainObject(payload);

    const actor = await this.userRepository.findById(actorUserId);

    if (actor === undefined) {
      throw unauthorized('No existe la sesion de usuario solicitada.');
    }

    if (actor.rol !== 'admin') {
      throw forbidden('Solo los administradores pueden crear nuevos usuarios.');
    }

    const email = parseEmail(payload.email, 'email');
    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser !== undefined) {
      throw conflict('Ya existe un usuario con ese email.');
    }

    const hashedPassword = await hashPassword(parsePassword(payload.contrasena));
    const role = parseOptionalUserRole(payload.rol) ?? 'usuario';

    const input: CreateUserInput = {
      nombre: parseString(payload.nombre, 'nombre'),
      apellido: parseString(payload.apellido, 'apellido'),
      email,
      contrasena: hashedPassword,
      rol: role,
    };

    return this.userRepository.create(input);
  }

  public async listUsers(): Promise<User[]> {
    return this.userRepository.list();
  }

  public async login(payload: unknown): Promise<User> {
    assertPlainObject(payload);

    const email = parseEmail(payload.email, 'email');
    const password = parsePassword(payload.contrasena);

    const userRow = await this.userRepository.findRowByEmail(email);

    if (userRow === undefined) {
      throw unauthorized('Credenciales invalidas.');
    }

    const validPassword = await verifyPassword(password, userRow.contrasena);

    if (!validPassword) {
      throw unauthorized('Credenciales invalidas.');
    }

    return {
      id: userRow.id,
      nombre: userRow.nombre,
      apellido: userRow.apellido,
      email: userRow.email,
      rol: userRow.rol,
      createdAt: userRow.created_at,
    };
  }

  public async getUser(id: number): Promise<User> {
    const user = await this.userRepository.findById(id);

    if (user === undefined) {
      throw notFound('Usuario no encontrado.');
    }

    return user;
  }

  public async updateUser(id: number, payload: unknown): Promise<User> {
    assertPlainObject(payload);

    const existingUser = await this.getUser(id);
    const existingUserRow = await this.userRepository.findRowById(id);

    if (existingUserRow === undefined) {
      throw notFound('Usuario no encontrado.');
    }

    const email =
      payload.email === undefined
        ? existingUser.email
        : parseEmail(payload.email, 'email');

    const userWithEmail = await this.userRepository.findByEmail(email);

    if (userWithEmail !== undefined && userWithEmail.id !== id) {
      throw conflict('Ya existe un usuario con ese email.');
    }

    const contrasena =
      payload.contrasena === undefined
        ? undefined
        : await hashPassword(parsePassword(payload.contrasena));

    const input: UpdateUserInput = {
      nombre:
        payload.nombre === undefined
          ? existingUser.nombre
          : parseString(payload.nombre, 'nombre'),
      apellido:
        payload.apellido === undefined
          ? existingUser.apellido
          : parseString(payload.apellido, 'apellido'),
      email,
      rol: parseOptionalUserRole(payload.rol) ?? existingUser.rol,
      contrasena: contrasena ?? existingUserRow.contrasena,
    };

    const updatedUser = await this.userRepository.update(id, input);

    if (updatedUser === undefined) {
      throw notFound('Usuario no encontrado.');
    }

    return updatedUser;
  }

  public async deleteUser(id: number): Promise<void> {
    const deleted = await this.userRepository.delete(id);

    if (!deleted) {
      throw notFound('Usuario no encontrado.');
    }
  }
}
