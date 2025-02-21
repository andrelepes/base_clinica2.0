Enum "tipousuario_enum" {
  "clinica"
  "psicologo_vinculado"
  "secretario_vinculado"
  "psicologo"
}

Table "agendamentos" {
  "agendamento_id" integer [pk, not null]
  "paciente_id" integer [not null]
  "usuario_id" integer [not null]
  "data_hora_inicio" timestamp [not null]
  "status" "character varying(255)" [not null]
  "notas_agendamento" "character varying(255)"
  "consultorio_id" integer
  "data_hora_fim" timestamp
  "historico" text
  "recorrencia" "character varying(50)"
  "tipo_sessao" integer
}

Table "anamnesis" {
  "anamnesis_id" integer [pk, not null]
  "usuario_id" integer [not null]
  "paciente_id" integer [not null]
  "marital_status" "character varying(20)"
  "care_modality" "character varying(10)"
  "gender" "character varying(10)"
  "occupation" "character varying(255)"
  "education_level" "character varying(30)"
  "socioeconomic_level" "character varying(60)"
  "special_needs" "character varying(15)"
  "referred_by" "character varying(50)"
  "undergoing_treatment" text
  "treatment_expectation" text
  "diagnosis" text
  "healthy_life_habits" text
  "relevant_information" text
  "created_at" timestamp [default: `now()`]
}

Table "anamnesis_changelog" {
  "anamnesis_change_id" integer [pk, not null]
  "anamnesis_id" integer [not null]
  "old_record" json [not null]
  "updated_at" timestamp [default: `CURRENT_TIMESTAMP`]
  "usuario_id" integer [not null]
}

Table "anamnesis_sign" {
  "anamnesis_sign_id" uuid [pk, not null]
  "anamnesis_id" integer [not null]
  "signed_at" timestamp [default: `CURRENT_TIMESTAMP`]
  "status" boolean [not null]
  "usuario_id" integer [not null]
}

Table "archives" {
  "archive_id" uuid [pk, not null]
  "archive_name" "character varying(255)" [not null]
  "archive_localization" "character varying(255)" [not null]
  "created_at" timestamp [default: `CURRENT_TIMESTAMP`]
  "archive_mime_type" "character varying(50)" [not null]
  "evolution_id" integer [not null]
}

Table "attended_options" {
  "id" integer [pk, not null]
  "title" "character varying(255)" [not null]
}

Table "autorizacoes" {
  "id_autorizacao" integer [pk, not null]
  "usuario_id" integer
  "paciente_id" integer
  "clinica_id" integer
  "status" "character varying(50)" [not null]
  "data_concessao" timestamp
  "data_retirada" timestamp

  Indexes {
    (usuario_id, paciente_id, clinica_id) [unique, name: "unique_vinculo"]
  }
}

Table "consultorios" {
  "consultorio_id" integer [pk, not null]
  "clinica_id" integer [not null]
  "nome_consultorio" "character varying(255)" [not null]
  "descricao" text
}

Table "evolution_changelog" {
  "evolution_change_id" integer [pk, not null]
  "evolution_id" integer [not null]
  "old_record" json [not null]
  "updated_at" timestamp [default: `CURRENT_TIMESTAMP`]
  "usuario_id" integer [not null]
}

Table "evolution_sign" {
  "evolution_sign_id" uuid [pk, not null]
  "evolution_id" integer [not null]
  "signed_at" timestamp [default: `CURRENT_TIMESTAMP`]
  "status" boolean [not null]
  "usuario_id" integer [not null]
}

Table "evolutions" {
  "evolution_id" integer [pk, not null]
  "usuario_id" integer [not null]
  "paciente_id" integer [not null]
  "attendance_status" integer
  "punctuality_status" integer
  "arrival_mood_state" integer
  "discussion_topic" text
  "analysis_intervention" text
  "next_session_plan" text
  "departure_mood_state" integer
  "therapist_notes" text
  "evolution_status" boolean [default: false]
  "agendamento_id" integer [unique]
  "created_at" timestamp
  "archive_id" uuid
}

Table "mood_states" {
  "id" integer [pk, not null]
  "value" numeric(2,1) [not null]
  "title" "character varying(255)" [not null]
}

Table "pacientes" {
  "paciente_id" integer [pk, not null]
  "nome_paciente" "character varying(255)" [not null]
  "data_nascimento_paciente" date
  "telefone_paciente" "character varying(15)"
  "email_paciente" "character varying(255)"
  "cep_paciente" "character varying(10)"
  "endereco_paciente" text
  "diagnostico" text
  "historico_medico" text
  "status_paciente" "character varying(10)" [default: `'ativo'::charactervarying`]
  "clinica_id" integer
  "usuario_id" integer [not null]
  "cpf_paciente" "character varying(18)"
  "inativado_por" integer
}

Table "patient_closure" {
  "patient_closure_id" integer [pk, not null]
  "usuario_id" integer [not null]
  "paciente_id" integer [not null]
  "case_status" "character varying(100)"
  "overall_results_evaluation" integer
  "initial_expectations_met" text
  "treatment_duration_sessions" integer
  "healthy_life_habits_acquired" text
  "additional_relevant_information" text
  "created_at" timestamp [default: `now()`]
}

Table "patient_closure_changelog" {
  "patient_closure_change_id" integer [pk, not null]
  "patient_closure_id" integer [not null]
  "old_record" json [not null]
  "updated_at" timestamp [default: `CURRENT_TIMESTAMP`]
  "usuario_id" integer [not null]
}

Table "patient_closure_sign" {
  "patient_closure_sign_id" uuid [pk, not null]
  "patient_closure_id" integer [not null]
  "signed_at" timestamp [default: `CURRENT_TIMESTAMP`]
  "status" boolean [not null]
  "usuario_id" integer [not null]
}

Table "payments" {
  "payment_id" uuid [pk, not null]
  "created_at" timestamp [not null, default: `now()`]
  "payment_status" "character varying(255)"
  "payment_code" text
  "payment_url" text
  "payment_qr_code" text
  "paciente_id" integer [not null]
  "clinica_id" integer [not null]
  "updated_at" timestamp
  "price" integer [default: 20]
  "mercado_id" integer [not null]
  "psicologo_id" integer
  "expires_in" timestamp
}

Table "punctuality_options" {
  "id" integer [pk, not null]
  "title" "character varying(255)" [not null]
}

Table "usuarios" {
  "usuario_id" integer [unique, pk, not null]
  "nome_usuario" "character varying(255)" [not null]
  "email_usuario" "character varying(255)" [unique, not null]
  "senha" "character varying(255)" [not null]
  "clinica_id" integer
  "tipousuario" tipousuario_enum [default: `'psicologo'::public.tipousuario_enum`]
  "cpfcnpj" "character varying(18)"
  "data_nascimento_usuario" date
  "telefone_usuario" "character varying(15)"
  "cep_usuario" "character varying(10)"
  "endereco_usuario" "character varying(255)"
  "qualificacoes" text
  "registro_profissional" "character varying(50)"
  "status_usuario" "character varying(50)" [default: `'ativo'::charactervarying`]
  "first_access" uuid
  "email_auxiliar" "character varying(255)"
  "start_hour" time [default: `'07:00:00'::timewithouttimezone`]
  "end_hour" time [default: `'22:00:00'::timewithouttimezone`]
  "monthly_fee" integer [default: '20']
  "expires_in_day" integer [default: '10']
}

Table "clinic_messages" {
  "message_id" serial [pk, not null, increment]
  "created_at" timestamp [not null, default: `now()`]
  "updated_at" timestamp [default: `now()`]
  "subject" "character varying(255)"
  "message" text
  "clinic_id" integer [not null]
  "usuario_id" integer
}

Table "clinic_details" {
  "clinic_id" integer [not null]
  "nome_coordenador" "character varying(255)" [not null]
  "email_coordenador" "character varying(255)"
  "telefone_coordenador" "character varying(15)"
  "cpf_coordenador" "character varying(14)"
}

Ref "agendamentos_consultorio_id_fkey":"consultorios"."consultorio_id" < "agendamentos"."consultorio_id"

Ref "agendamentos_paciente_id_fkey":"pacientes"."paciente_id" < "agendamentos"."paciente_id"

Ref "agendamentos_usuario_id_fkey":"usuarios"."usuario_id" < "agendamentos"."usuario_id"

Ref "anamnesis_changelog_anamnesis_id_fkey":"anamnesis"."anamnesis_id" < "anamnesis_changelog"."anamnesis_id"

Ref "anamnesis_changelog_usuario_id_fkey":"usuarios"."usuario_id" < "anamnesis_changelog"."usuario_id"

Ref "anamnesis_paciente_id_fkey":"pacientes"."paciente_id" < "anamnesis"."paciente_id"

Ref "anamnesis_sign_anamnesis_id_fkey":"anamnesis"."anamnesis_id" < "anamnesis_sign"."anamnesis_id"

Ref "anamnesis_sign_usuario_id_fkey":"usuarios"."usuario_id" < "anamnesis_sign"."usuario_id"

Ref "anamnesis_usuario_id_fkey":"usuarios"."usuario_id" < "anamnesis"."usuario_id"

Ref "autorizacoes_clinica_id_fkey":"usuarios"."usuario_id" < "autorizacoes"."clinica_id"

Ref "autorizacoes_paciente_id_fkey":"pacientes"."paciente_id" < "autorizacoes"."paciente_id"

Ref "autorizacoes_usuario_id_fkey":"usuarios"."usuario_id" < "autorizacoes"."usuario_id"

Ref "consultorios_clinica_id_fkey":"usuarios"."usuario_id" < "consultorios"."clinica_id"

Ref "evolution_changelog_evolution_id_fkey":"evolutions"."evolution_id" < "evolution_changelog"."evolution_id"

Ref "evolution_changelog_usuario_id_fkey":"usuarios"."usuario_id" < "evolution_changelog"."usuario_id"

Ref "evolution_sign_evolution_id_fkey":"evolutions"."evolution_id" < "evolution_sign"."evolution_id"

Ref "evolution_sign_usuario_id_fkey":"usuarios"."usuario_id" < "evolution_sign"."usuario_id"

Ref "evolutions_archive_id_fkey":"archives"."archive_id" < "evolutions"."archive_id" [delete: set null]

Ref "evolutions_arrival_mood_state_fkey":"mood_states"."id" < "evolutions"."arrival_mood_state"

Ref "evolutions_attendance_status_fkey":"attended_options"."id" < "evolutions"."attendance_status"

Ref "evolutions_departure_mood_state_fkey":"mood_states"."id" < "evolutions"."departure_mood_state"

Ref "evolutions_paciente_id_fkey":"pacientes"."paciente_id" < "evolutions"."paciente_id"

Ref "evolutions_punctuality_status_fkey":"punctuality_options"."id" < "evolutions"."punctuality_status"

Ref "evolutions_usuario_id_fkey":"usuarios"."usuario_id" < "evolutions"."usuario_id"

Ref "fk_agendamento":"agendamentos"."agendamento_id" < "evolutions"."agendamento_id"

Ref "pacientes_usuario_id_fkey":"usuarios"."usuario_id" < "pacientes"."usuario_id"

Ref "patient_closure_changelog_patient_closure_id_fkey":"patient_closure"."patient_closure_id" < "patient_closure_changelog"."patient_closure_id"

Ref "patient_closure_changelog_usuario_id_fkey":"usuarios"."usuario_id" < "patient_closure_changelog"."usuario_id"

Ref "patient_closure_paciente_id_fkey":"pacientes"."paciente_id" < "patient_closure"."paciente_id"

Ref "patient_closure_sign_patient_closure_id_fkey":"patient_closure"."patient_closure_id" < "patient_closure_sign"."patient_closure_id"

Ref "patient_closure_sign_usuario_id_fkey":"usuarios"."usuario_id" < "patient_closure_sign"."usuario_id"

Ref "patient_closure_usuario_id_fkey":"usuarios"."usuario_id" < "patient_closure"."usuario_id"

Ref "payments_clinicas_fk":"usuarios"."usuario_id" < "payments"."clinica_id" [delete: cascade]

Ref "payments_pacientes_fk":"pacientes"."paciente_id" < "payments"."paciente_id" [delete: set null]

Ref "payments_psicologos_fk":"usuarios"."usuario_id" < "payments"."psicologo_id"

Ref "clinic_details_usuarios_pk":"usuarios"."usuario_id" < "clinic_details"."clinic_id" [update: no action, delete: no action]
