interface ICreateEvolutionDTO {
  patient_id: string;
  psychologist_id: string;
  attendance_status: number;
  punctuality_status: number;
  arrival_mood_state: number;
  departure_mood_state: number;
  discussion_topic: string;
  analysis_intervention: string;
  next_session_plan: string;
  therapist_notes: string;
  evolution_status: boolean;
  appointment_id: string;
  archive_id: string;
}
interface IUpdateEvolutionDTO {
  attendance_status: number;
  punctuality_status: number;
  arrival_mood_state: number;
  departure_mood_state: number;
  discussion_topic: string;
  analysis_intervention: string;
  next_session_plan: string;
  therapist_notes: string;
  evolution_status: boolean;
  archive_id: string;
}
interface ICreateEvolutionChangelogDTO {
  evolution_id: string;
  old_record: IUpdateEvolutionDTO;
  updated_by: string;
  updated_by_role: Roles;
}

export {
  ICreateEvolutionDTO,
  IUpdateEvolutionDTO,
  ICreateEvolutionChangelogDTO,
};
