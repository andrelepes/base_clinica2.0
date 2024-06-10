import { ICreateAnamnesisDTO, IUpdateAnamnesisDTO } from 'dtos/AnamnesisDTOs';
import { Anamnesis } from '../entities/Anamnesis';
import { IGenericRepository } from './IGenericRepository';

interface IAnamnesisRepository
  extends IGenericRepository<
    Anamnesis,
    string,
    ICreateAnamnesisDTO,
    IUpdateAnamnesisDTO
  > {}

export { IAnamnesisRepository };
