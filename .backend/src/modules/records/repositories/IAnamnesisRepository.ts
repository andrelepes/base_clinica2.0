import { ICreateAnamnesisDTO, IUpdateAnamnesisDTO } from 'modules/records/dtos/AnamnesisDTOs';
import { Anamnesis } from 'modules/records/entities/Anamnesis';
import { IGenericRepository } from 'modules/shared/repositories/IGenericRepository';

interface IAnamnesisRepository
  extends IGenericRepository<
    Anamnesis,
    string,
    ICreateAnamnesisDTO,
    IUpdateAnamnesisDTO
  > {}

export { IAnamnesisRepository };
