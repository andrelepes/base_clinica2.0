import { Roles } from "utils/enums";

interface ICreatePatientClosureDTO {
  patient_id: string;
  psychologist_id: string;
  case_status: string;
  overall_results_evaluatuion: number;
  initial_expectations_met: string;
  treatment_duration_sessions: number;
  healthy_life_habits_acquired: string;
}
interface IUpdatePatientClosureDTO {
  case_status: string;
  overall_results_evaluatuion: number;
  initial_expectations_met: string;
  treatment_duration_sessions: number;
  healthy_life_habits_acquired: string;
}

interface ICreatePatientClosureChangelogDTO {
  closure_id: string;
  old_record: IUpdatePatientClosureDTO;
  updated_by: string;
  updated_by_role: Roles;
}

export {
  ICreatePatientClosureDTO,
  IUpdatePatientClosureDTO,
  ICreatePatientClosureChangelogDTO,
};
