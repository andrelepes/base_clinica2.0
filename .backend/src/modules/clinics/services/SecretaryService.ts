import { ICreateSecretaryDTO, IUpdateSecretaryDTO } from 'modules/clinics/dtos/SecretariesDTOs';
import { Secretary } from 'modules/clinics/entities/Secretary';
import { AppError } from 'errors/AppError';
import { ISecretariesRepository } from 'modules/clinics/repositories/ISecretariesRepository';

class SecretaryService {
  private secretaryRepository: ISecretariesRepository;

  constructor(secretaryRepository: ISecretariesRepository) {
    this.secretaryRepository = secretaryRepository;
  }

  async createSecretary({
    clinic_id,
    secretary_mail,
    secretary_name,
    secretary_phone,
    user_id,
  }: ICreateSecretaryDTO): Promise<void> {
    const secretaryExists = await this.secretaryRepository.findByEmail(
      secretary_mail
    );

    if (secretaryExists) {
      throw new AppError('Secretary already exists', 409);
    }

    await this.secretaryRepository.create({
      clinic_id,
      secretary_mail,
      secretary_name,
      secretary_phone,
      user_id,
    });
  }

  async updateSecretary(
    secretary_id: string,
    { secretary_mail, secretary_name, secretary_phone }: IUpdateSecretaryDTO
  ): Promise<void> {
    const secretaryExists = await this.secretaryRepository.findById(
      secretary_id
    );

    if (!secretaryExists) {
      throw new AppError('Secretary not found', 404);
    }

    const emailInUse = await this.secretaryRepository.findByEmail(
      secretary_mail
    );

    if (emailInUse && emailInUse.secretary_id !== secretary_id) {
      throw new AppError('Email already in use', 409);
    }

    await this.secretaryRepository.update(secretary_id, {
      secretary_mail,
      secretary_name,
      secretary_phone,
    });
  }

  async getSecretariesByClinic(clinic_id: string): Promise<Secretary[]> {
    const secretaries = await this.secretaryRepository.findByClinicId(
      clinic_id
    );

    return secretaries;
  }
  async deleteSecretary(secretary_id: string): Promise<void> {
    const secretaryExists = await this.secretaryRepository.findById(
      secretary_id
    );

    if (!secretaryExists) {
      throw new AppError('Secretary not found', 404);
    }

    await this.secretaryRepository.delete(secretary_id);
  }
}

export { SecretaryService };
