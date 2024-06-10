interface OldEvolutionRecord {
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
}

class EvolutionChangelog {
  evolution_change_id?: number;
  
  evolution_id: string;
  
  old_record: OldEvolutionRecord;
  
  updated_at: Date;
  
  updated_by: string;
  
  updated_by_role: Roles;

  constructor(
    evolution_id: string,
    old_record: OldEvolutionRecord,
    updated_at: Date,
    updated_by: string,
    updated_by_role: Roles,
    evolution_change_id?: number
  ) {
    this.evolution_change_id = evolution_change_id;
    this.evolution_id = evolution_id;
    this.old_record = old_record;
    this.updated_at = updated_at;
    this.updated_by = updated_by;
    this.updated_by_role = updated_by_role;
  }
}

export { EvolutionChangelog };
