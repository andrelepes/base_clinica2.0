import { Roles } from 'utils/enums';

class AvailableTime {
  slot_id?: number;

  slot_start_time: string;

  slot_end_time: string;

  day_of_week: number;

  provider_id: string;

  provider_type: Roles;

  constructor({
    slot_start_time,
    slot_end_time,
    day_of_week,
    provider_id,
    provider_type,
    slot_id,
  }: AvailableTime) {
    this.slot_id = slot_id;
    this.slot_start_time = slot_start_time;
    this.slot_end_time = slot_end_time;
    this.day_of_week = day_of_week;
    this.provider_id = provider_id;
    this.provider_type = provider_type;
  }
}

export { AvailableTime };
