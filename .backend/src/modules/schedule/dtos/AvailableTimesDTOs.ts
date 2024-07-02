import { Roles } from "utils/enums";

interface ICreateAvailableTimeDTO {
  slot_start_time: string;
  slot_end_time: string;
  day_of_week: number;
  provider_id: string;
  provider_type: Roles;
}
interface IUpdateAvailableTimeDTO {
  slot_start_time: string;
  slot_end_time: string;
  day_of_week: number;
}

export { ICreateAvailableTimeDTO, IUpdateAvailableTimeDTO };
