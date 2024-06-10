import { ICreateClinicDTO, IUpdateClinicDTO } from 'dtos/ClinicsDTOs';
import { Clinic } from '../entities/Clinic';
import { IGenericRepository } from './IGenericRepository';

interface IClinicRepository
  extends IGenericRepository<
    Clinic,
    string,
    ICreateClinicDTO,
    IUpdateClinicDTO
  > {
  findByCnpj(cnpj: string): Promise<Clinic | null>;
}

export { IClinicRepository };
