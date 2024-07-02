import { v4 as uuidv4 } from 'uuid';

class Evolution {
  evolution_id?: string;

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

  created_at: Date;

  archive_id: string;
  constructor({
    patient_id,
    psychologist_id,
    attendance_status,
    punctuality_status,
    arrival_mood_state,
    departure_mood_state,
    discussion_topic,
    analysis_intervention,
    next_session_plan,
    therapist_notes,
    evolution_status,
    appointment_id,
    archive_id,
  }: Evolution) {
    this.evolution_id = this.evolution_id || uuidv4();
    this.patient_id = patient_id;
    this.psychologist_id = psychologist_id;
    this.attendance_status = attendance_status;
    this.punctuality_status = punctuality_status;
    this.arrival_mood_state = arrival_mood_state;
    this.departure_mood_state = departure_mood_state;
    this.discussion_topic = discussion_topic;
    this.analysis_intervention = analysis_intervention;
    this.next_session_plan = next_session_plan;
    this.therapist_notes = therapist_notes;
    this.evolution_status = evolution_status;
    this.appointment_id = appointment_id;
    this.created_at = new Date();
    this.archive_id = archive_id;
  }
}

export { Evolution };
