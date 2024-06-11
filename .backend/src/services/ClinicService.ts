import { ICreateClinicDTO, IUpdateClinicDTO } from 'dtos/ClinicsDTOs';
import { AppError } from 'errors/AppError';
import { IClinicRepository } from 'repositories/IClinicRepository';
import { ClinicChangelogService } from './ClinicChangelogService';
import { Clinic } from 'entities/Clinic';

class CLinicService {
  private clinicRepository: IClinicRepository;
  private clinicChangelogService: ClinicChangelogService;

  constructor(
    clinicRepository: IClinicRepository,
    clinicalChangelogService: ClinicChangelogService
  ) {
    this.clinicRepository = clinicRepository;
    this.clinicChangelogService = clinicalChangelogService;
  }

  async createClinic(data: ICreateClinicDTO): Promise<void> {
    const cnpjExists = await this.clinicRepository.findByCnpj(data.clinic_cnpj);
    if (cnpjExists) {
      throw new AppError('CNPJ already in use', 409);
    }

    await this.clinicRepository.create(data);
  }

  async updateClinic(clinic_id: string, data: IUpdateClinicDTO): Promise<void> {
    const clinicExists = await this.clinicRepository.findById(clinic_id);

    if (!clinicExists) {
      throw new AppError('Clinic not found', 404);
    }

    await this.clinicChangelogService.createChangelog({
      clinic_id,
      old_record: clinicExists,
    });

    await this.clinicRepository.update(clinic_id, data);
  }

  async getClinicInfo(clinic_id: string): Promise<Clinic> {
    const clinic = await this.clinicRepository.findById(clinic_id);

    if (!clinic) {
      throw new AppError('Clinic not found', 404);
    }

    return clinic;
  }

  async deleteClinic(clinic_id: string): Promise<void> {
    const clinicExists = await this.clinicRepository.findById(clinic_id);

    if (!clinicExists) {
      throw new AppError('Clinic not found', 404);
    }
    await this.clinicRepository.delete(clinic_id);
  }
}
export { CLinicService };
