import { all, get, run } from '../database/sqlite.js';
import type {
  CreateUserInput,
  UpdateUserInput,
  User,
  UserRow,
} from '../models/index.js';

function mapUserRow(row: UserRow): User {
  return {
    id: row.id,
    nombre: row.nombre,
    apellido: row.apellido,
    email: row.email,
    rol: row.rol,
    createdAt: row.created_at,
  };
}

export class UserRepository {
  public async findRowById(id: number): Promise<UserRow | undefined> {
    return get<UserRow>('SELECT * FROM users WHERE id = ?;', [id]);
  }

  public async findRowByEmail(email: string): Promise<UserRow | undefined> {
    return get<UserRow>('SELECT * FROM users WHERE email = ?;', [email]);
  }

  public async create(input: CreateUserInput): Promise<User> {
    const result = await run(
      `
        INSERT INTO users (nombre, apellido, email, contrasena, rol)
        VALUES (?, ?, ?, ?, ?);
      `,
      [input.nombre, input.apellido, input.email, input.contrasena, input.rol],
    );

    const createdUser = await this.findById(result.lastId);

    if (createdUser === undefined) {
      throw new Error('No se pudo recuperar el usuario recien creado.');
    }

    return createdUser;
  }

  public async list(): Promise<User[]> {
    const rows = await all<UserRow>('SELECT * FROM users ORDER BY id DESC;');
    return rows.map(mapUserRow);
  }

  public async findById(id: number): Promise<User | undefined> {
    const row = await this.findRowById(id);
    return row === undefined ? undefined : mapUserRow(row);
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const row = await this.findRowByEmail(email);
    return row === undefined ? undefined : mapUserRow(row);
  }

  public async update(id: number, input: UpdateUserInput): Promise<User | undefined> {
    await run(
      `
        UPDATE users
        SET nombre = ?, apellido = ?, email = ?, contrasena = ?, rol = ?
        WHERE id = ?;
      `,
      [input.nombre, input.apellido, input.email, input.contrasena, input.rol, id],
    );

    return this.findById(id);
  }

  public async delete(id: number): Promise<boolean> {
    const result = await run('DELETE FROM users WHERE id = ?;', [id]);
    return result.changes > 0;
  }
}
