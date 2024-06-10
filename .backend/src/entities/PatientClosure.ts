import { v4 as uuidv4 } from 'uuid';

class PatientClosure {
  closure_id?: string;

  patient_id: string;

  psychologist_id: string;

  case_status: string;

  overall_results_evaluatuion: number;

  initial_expectations_met: string;

  treatment_duration_sessions: number;

  healthy_life_habits_acquired: string;

  created_at: Date;

  constructor(
    patient_id: string,
    psychologist_id: string,
    case_status: string,
    overall_results_evaluatuion: number,
    initial_expectations_met: string,
    treatment_duration_sessions: number,
    healthy_life_habits_acquired: string
  ) {
    this.closure_id = this.closure_id || uuidv4();
    this.patient_id = patient_id;
    this.psychologist_id = psychologist_id;
    this.case_status = case_status;
    this.overall_results_evaluatuion = overall_results_evaluatuion;
    this.initial_expectations_met = initial_expectations_met;
    this.treatment_duration_sessions = treatment_duration_sessions;
    this.healthy_life_habits_acquired = healthy_life_habits_acquired;
    this.created_at = new Date();
  }
}

export { PatientClosure };
