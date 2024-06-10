import { ICreateClinicChangelogDTO } from 'dtos/ClinicsDTOs';
import { ClinicChangelog } from 'entities/ClinicChangelog';
import { IClinicChangelogRepository } from 'repositories/IClinicChangelogRepository';

class ClinicChangelogService {
  private clinicChangelogRepository: IClinicChangelogRepository;

  constructor(clinicChangelogRepository: IClinicChangelogRepository) {
    this.clinicChangelogRepository = clinicChangelogRepository;
  }

  async createChangelog({
    clinic_id,
    old_record,
  }: ICreateClinicChangelogDTO): Promise<void> {
    await this.clinicChangelogRepository.create({ clinic_id, old_record });
  }

  async getAllChangelogs(clinic_id: string): Promise<ClinicChangelog[]> {
    const changes = await this.clinicChangelogRepository.findAllById(clinic_id);
    return changes;
  }
}

export { ClinicChangelogService };
