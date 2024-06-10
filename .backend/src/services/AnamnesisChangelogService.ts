import { ICreateAnamnesisChangelogDTO } from 'dtos/AnamnesisDTOs';
import { AnamnesisChangelog } from 'entities/AnamnesisChangelog';
import { AppError } from 'errors/AppError';
import { IAnamnesisChangelogRepository } from 'repositories/IAnamnesisChangelogRepository';

class AnamnesisChangelogService {
  private anamnesisChangelogRepository: IAnamnesisChangelogRepository;

  constructor(anamnesisChangelogRepository: IAnamnesisChangelogRepository) {
    this.anamnesisChangelogRepository = anamnesisChangelogRepository;
  }

  async createChangelog({
    anamnesis_id,
    old_record,
    updated_by,
    updated_by_role,
  }: ICreateAnamnesisChangelogDTO): Promise<void> {
    if (updated_by_role === (Roles.Patient || Roles.Secretary)) {
      throw new AppError('User does not have permission', 403);
    }
    await this.anamnesisChangelogRepository.create({
      anamnesis_id,
      old_record,
      updated_by,
      updated_by_role,
    });
  }

  async getAllChangelogs(anamnesis_id: string): Promise<AnamnesisChangelog[]> {
    const changes = await this.anamnesisChangelogRepository.findAllById(
      anamnesis_id
    );
    return changes;
  }
}

export { AnamnesisChangelogService };
