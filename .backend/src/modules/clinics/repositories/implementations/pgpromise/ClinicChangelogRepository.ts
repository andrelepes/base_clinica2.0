import { ICreateClinicChangelogDTO } from 'modules/clinics/dtos/ClinicsDTOs';
import { ClinicChangelog } from 'modules/clinics/entities/ClinicChangelog';
import { IClinicChangelogRepository } from '../../IClinicChangelogRepository';
import db from 'config/database';

class ClinicChangelogRepository implements IClinicChangelogRepository {
  private tableName = 'clinic_changelog';
  async create(data: ICreateClinicChangelogDTO): Promise<void> {
    const query = `INSERT INTO ${this.tableName} (clinic_id, old_record) VALUES ($1, $2)`;
    await db.none(query, [data.clinic_id, JSON.stringify(data.old_record)]);
  }
  async findAllById(id: string): Promise<ClinicChangelog[]> {
    const query = `SELECT * FROM ${this.tableName} WHERE clinic_id = $1`;

    return await db.manyOrNone(query, id);
  }
}

export { ClinicChangelogRepository };
