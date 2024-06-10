import { ICreateOfficeDTO, IUpdateOfficeDTO } from 'dtos/OfficesDTOs';
import { Office } from 'entities/Office';
import { AppError } from 'errors/AppError';
import { IOfficesRepository } from 'repositories/IOfficesRepository';

class OfficeService {
  private officesRepository: IOfficesRepository;

  constructor(officesRepository: IOfficesRepository) {
    this.officesRepository = officesRepository;
  }

  async createOffice({
    clinic_id,
    office_name,
  }: ICreateOfficeDTO): Promise<void> {
    const office = await this.officesRepository.findByName(office_name);
    if (office && office.clinic_id === clinic_id) {
      throw new AppError('Office already exists', 409);
    }

    await this.officesRepository.create({
      clinic_id,
      office_name,
    });
  }

  async updateOffice(
    office_id: number,
    { office_name }: IUpdateOfficeDTO
  ): Promise<void> {
    const office = await this.officesRepository.findById(office_id);
    if (!office) {
      throw new AppError('Office not found', 404);
    }

    const verifyName = await this.officesRepository.findByName(office_name);

    if (verifyName && verifyName.clinic_id === office.clinic_id) {
      throw new AppError('Office name in use', 409);
    }

    await this.officesRepository.update(office_id, {
      office_name,
    });
  }

  async getOfficesByClinic(
    clinic_id: string,
    user_role: Roles
  ): Promise<Office[]> {
    if (user_role === Roles.Patient) {
      throw new AppError('User role not allowed', 403);
    }

    const offices = await this.officesRepository.findByClinic(clinic_id);

    return offices;
  }

  async deleteOffice(office_id: number): Promise<void> {
    const office = await this.officesRepository.findById(office_id);

    if (!office) {
      throw new AppError('Office not found', 404);
    }

    const isVacantOffice =
      await this.officesRepository.ensureNoFutureAppointments(office_id);

    if (!isVacantOffice) {
      throw new AppError('Office is in use', 409);
    }

    await this.officesRepository.delete(office_id);
  }
}

export { OfficeService };
