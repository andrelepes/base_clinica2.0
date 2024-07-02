import { ICreateOfficeDTO, IUpdateOfficeDTO } from 'modules/clinics/dtos/OfficesDTOs';
import { Office } from 'modules/clinics/entities/Office';
import { IGenericRepository } from 'modules/shared/repositories/IGenericRepository';

interface IOfficesRepository
  extends IGenericRepository<
    Office,
    number,
    ICreateOfficeDTO,
    IUpdateOfficeDTO
  > {
  findByClinic(id: string): Promise<Office[]>;
  findByName(name: string): Promise<Office | null>;
  ensureNoFutureAppointments(id: number): Promise<boolean>;
}

export { IOfficesRepository };
