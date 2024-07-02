import {
  ICreateAvailableTimeDTO,
  IUpdateAvailableTimeDTO,
} from 'modules/schedule/dtos/AvailableTimesDTOs';
import { AvailableTime } from 'modules/schedule/entities/AvailableTime';
import { IGenericRepository } from 'modules/shared/repositories/IGenericRepository';

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
