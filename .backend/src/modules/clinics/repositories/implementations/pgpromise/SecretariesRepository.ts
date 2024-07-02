import {
  ICreateSecretaryDTO,
  IUpdateSecretaryDTO,
} from 'modules/clinics/dtos/SecretariesDTOs';
import { Secretary } from 'modules/clinics/entities/Secretary';
import { ISecretariesRepository } from '../../ISecretariesRepository';
import db from 'config/database';

class SecretariesRepository implements ISecretariesRepository {
  private tableName = 'secretaries';
  async findByClinicId(id: string): Promise<Secretary[]> {
    const query = `SELECT * FROM ${this.tableName} WHERE clinic_id = $1`;

    return await db.manyOrNone(query, id);
  }
  async findByEmail(email: string): Promise<Secretary | null> {
    const query = `SELECT * FROM ${this.tableName} WHERE secretary_mail = $1`;

    return await db.oneOrNone(query, email);
  }
  async create(data: ICreateSecretaryDTO): Promise<void> {
    const query = `
      INSERT INTO ${this.tableName} 
         (secretary_id, user_id, clinic_id, secretary_name, secretary_phone, secretary_mail)
      VALUES 
         ($1, $2, $3, $4, $5, $6)
   `;

    const newSecretary = new Secretary({
      ...data,
    });

    const values = [
      newSecretary.secretary_id,
      newSecretary.user_id,
      newSecretary.clinic_id,
      newSecretary.secretary_name,
      newSecretary.secretary_phone,
      newSecretary.secretary_mail,
    ];

    await db.none(query, values);
  }
  async findById(id: string): Promise<Secretary | null> {
    const query = `SELECT * FROM ${this.tableName} WHERE secretary_id = $1`;

    return await db.oneOrNone(query, id);
  }
  async update(id: string, data: Partial<IUpdateSecretaryDTO>): Promise<void> {
    const columns = Object.entries(data)
      .map(([key, value], index) => `${key} = $${index + 1}`)
      .join(', ');
    const values = [...Object.values(data), id];

    const query = `
      UPDATE ${this.tableName}
      SET ${columns}
      WHERE secretary_id = $${values.length}
    `;
    await db.none(query, values);
  }
  async delete(id: string): Promise<void> {
    const query = `DELETE FROM ${this.tableName} WHERE secretary_id = $1`;

    await db.none(query, id);
  }
}

export { SecretariesRepository };
