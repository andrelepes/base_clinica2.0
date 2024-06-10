import {
  ICreateAvailableTimeDTO,
  IUpdateAvailableTimeDTO,
} from 'dtos/AvailableTimesDTOs';
import { AvailableTime } from '../entities/AvailableTime';
import { IGenericRepository } from './IGenericRepository';

interface IAvailableTimesRepository
  extends IGenericRepository<
    AvailableTime,
    number,
    ICreateAvailableTimeDTO,
    IUpdateAvailableTimeDTO
  > {
  findByProvider(id: string): Promise<AvailableTime[]>;
}

export { IAvailableTimesRepository };
