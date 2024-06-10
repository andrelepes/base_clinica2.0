import { ICreateOfficeDTO, IUpdateOfficeDTO } from 'dtos/OfficesDTOs';
import { Office } from '../entities/Office';
import { IGenericRepository } from './IGenericRepository';

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
