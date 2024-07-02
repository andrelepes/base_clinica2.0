import {
  ICreateOfficeDTO,
  IUpdateOfficeDTO,
} from 'modules/clinics/dtos/OfficesDTOs';
import { Office } from 'modules/clinics/entities/Office';
import { IOfficesRepository } from '../../IOfficesRepository';
import db from 'config/database';

class OfficesRepository implements IOfficesRepository {
  private tableName = 'offices';
  async findByClinic(id: string): Promise<Office[]> {
    const query = `SELECT * FROM ${this.tableName} WHERE clinic_id = $1`;

    return await db.manyOrNone(query, [id]);
  }
  findByName(name: string): Promise<Office | null> {
    throw new Error('Method not implemented.');
  }
  async create(data: ICreateOfficeDTO): Promise<void> {
    const query = `
      INSERT INTO ${this.tableName} 
         (office_id, clinic_id, office_name)
      VALUES 
         ($1, $2, $3)
   `;

    const newOffice = new Office({
      ...data,
    });

    const values = [
      newOffice.office_id,
      newOffice.clinic_id,
      newOffice.office_name,
    ];

    await db.none(query, values);
  }
  async findById(id: number): Promise<Office | null> {
    const query = `SELECT * FROM ${this.tableName} WHERE office_id = $1`;

    return await db.oneOrNone(query, [id]);
  }
  async update(id: number, data: Partial<IUpdateOfficeDTO>): Promise<void> {
    const query = `UPDATE ${this.tableName} SET office_name = $1 WHERE office_id = $2`;

    await db.none(query, [data, id]);
  }
  async delete(id: number): Promise<void> {
    const query = `DELETE FROM ${this.tableName} WHERE office_id = $1`;

    await db.none(query, [id]);
  }
}

export { OfficesRepository };
