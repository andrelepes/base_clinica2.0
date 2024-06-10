interface OldClosureRecord {
  case_status: string;
  overall_results_evaluatuion: number;
  initial_expectations_met: string;
  treatment_duration_sessions: number;
  healthy_life_habits_acquired: string;
}

class PatientClosureChangelog {
  closure_change_id?: number;

  closure_id: string;

  old_record: OldClosureRecord;

  updated_at: Date;

  updated_by: string;

  updated_by_role: Roles;

  constructor(
    closure_change_id: number,
    closure_id: string,
    old_record: OldClosureRecord,
    updated_by: string,
    updated_by_role: Roles
  ) {
    this.closure_change_id = closure_change_id;
    this.updated_at = new Date();
    this.closure_id = closure_id;
    this.old_record = old_record;
    this.updated_by = updated_by;
    this.updated_by_role = updated_by_role;
  }
}

export { PatientClosureChangelog };
