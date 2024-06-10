import { ICreateArchiveDTO } from 'dtos/ArchivesDTOs';

interface IArchivesRepository {
  create(data: ICreateArchiveDTO): Promise<void>;
  findById(id: string): Promise<void>;
}

export { IArchivesRepository };
