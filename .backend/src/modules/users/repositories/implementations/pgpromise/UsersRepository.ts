import db from 'config/database';
import { ICreateUserDTO, IUpdateUserDTO } from 'modules/users/dtos/UsersDTOs';
import { User } from 'modules/users/entities/User';
import { IUsersRepository } from 'modules/users/repositories/IUsersRepository';

class UsersRepository implements IUsersRepository {
  async findByEmail(email: string): Promise<User | null> {
    const query = `
         SELECT
            *
         FROM
            users
         WHERE
            user_email = $1
      `;
    return await db.oneOrNone<User>(query, email);
  }
  async create(data: ICreateUserDTO): Promise<void> {
    const query = `
         INSERT INTO users
            (user_id, user_email, user_password, user_role, user_status, profile_id, first_access_token)
         VALUES
            ($1, $2, $3, $4, $5, $6, $7)
      `;

    const newUser = new User({ ...(data as User) });

    const values = [
      newUser.user_id,
      newUser.user_email,
      newUser.user_password,
      newUser.user_role,
      newUser.user_status,
      newUser.profile_id,
      newUser.first_access_token,
    ];

    await db.none(query, values);
  }
  async findById(id: string): Promise<User | null> {
    const query = `
      SELECT
         *
      FROM
         users
      WHERE
         user_id = $1
    `;
    return await db.oneOrNone(query, id);
  }
  async update(id: string, data: Partial<IUpdateUserDTO>): Promise<void> {
    const columns = Object.entries(data)
      .map(([key, value], index) => `${key} = $${index + 1}`)
      .join(', ');
    const values = [...Object.values(data), id];

    const query = `
         UPDATE users
         SET ${columns}
         WHERE user_id = $${values.length}
      `;
    await db.none(query, values);
  }
  delete(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}

export { UsersRepository };
