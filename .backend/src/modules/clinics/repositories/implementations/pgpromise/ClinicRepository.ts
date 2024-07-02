import db from 'config/database';
import { ICreateClinicDTO, IUpdateClinicDTO } from 'modules/clinics/dtos/ClinicsDTOs';
import { Clinic } from 'modules/clinics/entities/Clinic';
import { IClinicRepository } from 'modules/clinics/repositories/IClinicRepository';

class ClinicRepository implements IClinicRepository {
  async findByCnpj(cnpj: string): Promise<Clinic | null> {
    const query = `
         SELECT 
            *
         FROM
            clinics
         WHERE 
            clinic_cnpj = $1
      `;

    return await db.oneOrNone(query, cnpj);
  }
  async create(data: ICreateClinicDTO): Promise<void> {
    const query = `
      INSERT INTO clinics 
         (clinic_id, user_id, clinic_cnpj, clinic_name, clinic_email, clinic_cep, clinic_address, clinic_phone, clinic_administrator_name)
      VALUES 
         ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `;

    const newClinic = new Clinic({
      ...(data as Clinic),
    });

    const values = [
      newClinic.clinic_id,
      newClinic.user_id,
      newClinic.clinic_cnpj,
      newClinic.clinic_name,
      newClinic.clinic_email,
      newClinic.clinic_cep,
      newClinic.clinic_address,
      newClinic.clinic_phone,
      newClinic.clinic_administrator_name,
    ];

    await db.none(query, values);
  }
  async findById(id: string): Promise<Clinic | null> {
    const query = `
      SELECT 
         *
      FROM
         clinics
      WHERE 
         clinic_id = $1
   `;

    return await db.oneOrNone(query, id);
  }
  async update(id: string, data: Partial<IUpdateClinicDTO>): Promise<void> {
    const columns = Object.entries(data)
      .map(([key, value], index) => `${key} = $${index + 1}`)
      .join(', ');
    const values = [...Object.values(data), id];

    const query = `
      UPDATE clinics
      SET ${columns}
      WHERE clinic_id = $${values.length}
   `;
    await db.none(query, values);
  }
  delete(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}

export { ClinicRepository };
