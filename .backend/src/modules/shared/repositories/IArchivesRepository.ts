import { ICreateArchiveDTO } from 'modules/shared/dtos/ArchivesDTOs';
import { Archive } from '../entities/Archive';

interface IArchivesRepository {
  create(data: ICreateArchiveDTO): Promise<void>;
  findById(id: string): Promise<Archive>;
}

export { IArchivesRepository };
