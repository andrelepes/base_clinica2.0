import { ICreateClinicDTO, IUpdateClinicDTO } from 'modules/clinics/dtos/ClinicsDTOs';
import { Clinic } from 'modules/clinics/entities/Clinic';
import { IGenericRepository } from 'modules/shared/repositories/IGenericRepository';

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
