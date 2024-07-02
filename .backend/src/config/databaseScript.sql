CREATE TABLE
  archives (
    archive_id UUID PRIMARY KEY,
    archive_name VARCHAR(255) NOT NULL,
    archive_localization VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    archive_extension VARCHAR(10) NOT NULL,
    archive_mime_type VARCHAR(50) NOT NULL
  );

CREATE TABLE
  status_types (
    status_id INT PRIMARY KEY,
    status_name VARCHAR(50) NOT NULL
  );

INSERT INTO
  status_types (status_id, status_name)
VALUES
  (1, 'Ativo'),
  (2, 'Inativo'),
  (3, 'Aguardando Confirmação'),
  (4, 'Suspenso'),
  (5, 'Arquivado');

CREATE TABLE
  user_roles (
    role_id INT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL
  );

INSERT INTO
  user_roles (role_id, role_name)
VALUES
  (1, 'Clinica Escola'),
  (2, 'Psicologo Aluno'),
  (3, 'Psicologo Responsavel'),
  (4, 'Paciente'),
  (5, 'Secretario');

CREATE TABLE
  attended_options (
    attended_id INT PRIMARY KEY,
    title VARCHAR(255) NOT NULL
  );

INSERT INTO
  attended_options (attended_id, title)
VALUES
  (1, 'Sim'),
  (2, 'Não, reagendado'),
  (3, 'Não, mas cancelado antes de 24h'),
  (4, 'Não comparecimento'),
  (5, 'Desmarcado pelo psicoterapeuta'),
  (6, 'Outro');

CREATE TABLE
  punctuality_options (
    punctuality_id INT PRIMARY KEY,
    title VARCHAR(255) NOT NULL
  );

INSERT INTO
  punctuality_options (punctuality_id, title)
VALUES
  (1, 'No horário'),
  (2, 'Antecipado'),
  (3, 'Atrasado');

CREATE TABLE
  mood_states (
    mood_id INT PRIMARY KEY,
    value DECIMAL(2, 1) NOT NULL,
    title VARCHAR(255) NOT NULL
  );

INSERT INTO
  mood_states (mood_id, value, title)
VALUES
  (1, 0.5, 'Muito Ruim'),
  (2, 1.0, 'Ruim'),
  (3, 1.5, 'Insatisfatório'),
  (4, 2.0, 'Abaixo da Média'),
  (5, 2.5, 'Médio'),
  (6, 3.0, 'Razoável'),
  (7, 3.5, 'Bom'),
  (8, 4.0, 'Muito Bom'),
  (9, 4.5, 'Excelente'),
  (10, 5.0, 'Fantástico');

CREATE TABLE
  appointment_status (
    appointment_status_id INT PRIMARY KEY,
    appointment_status_name VARCHAR(255) NOT NULL
  );

INSERT INTO
  appointment_status (appointment_status_id, appointment_status_name)
VALUES
  (1, 'Agendado'),
  (2, 'Confirmado'),
  (3, 'Cancelado'),
  (4, 'Concluído'),
  (5, 'Remarcado');

CREATE TABLE
  recurrence_options (recurrence_id INT PRIMARY KEY, title VARCHAR(20));

INSERT INTO
  recurrence_options (recurrence_id, title)
VALUES
  (1, 'Nenhuma'),
  (2, 'Semanal'),
  (3, 'Quinzenal'),
  (4, 'Mensal');

CREATE TABLE
  users (
    user_id UUID PRIMARY KEY,
    profile_id UUID NOT NULL,
    first_access_token TEXT,
    user_email VARCHAR(255) NOT NULL,
    user_password VARCHAR(255) NOT NULL,
    user_status INT REFERENCES status_types (status_id),
    user_role INT REFERENCES user_roles (role_id)
  );

CREATE TABLE
  clinics (
    clinic_id UUID PRIMARY KEY,
    user_id UUID REFERENCES users (user_id),
    clinic_cnpj VARCHAR(18) NOT NULL,
    clinic_name VARCHAR(255) NOT NULL,
    clinic_email VARCHAR(255) NOT NULL,
    clinic_cep VARCHAR(8) NOT NULL,
    clinic_address VARCHAR(255) NOT NULL,
    clinic_phone VARCHAR(25) NOT NULL,
    clinic_administrator_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

CREATE TABLE
  clinic_changelog (
    clinic_change_id SERIAL PRIMARY KEY,
    clinic_id UUID REFERENCES clinics (clinic_id),
    old_record JSON NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

CREATE TABLE
  secretaries (
    secretary_id UUID PRIMARY KEY,
    user_id UUID REFERENCES users (user_id),
    secretary_name VARCHAR(255) NOT NULL,
    secretary_phone VARCHAR(25) NOT NULL,
    secretary_mail VARCHAR(255) NOT NULL,
    clinic_id UUID REFERENCES clinics (clinic_id)
  );

CREATE TABLE
  psychologists (
    psychologist_id UUID PRIMARY KEY,
    user_id UUID REFERENCES users (user_id),
    psychologist_cpf VARCHAR(11) NOT NULL,
    psychologist_birth_date DATE NOT NULL,
    student_code VARCHAR(10) NOT NULL,
    psychologist_name VARCHAR(255) NOT NULL,
    psychologist_phone VARCHAR(25) NOT NULL,
    psychologist_cep VARCHAR(8) NOT NULL,
    psychologist_address VARCHAR(255) NOT NULL,
    psychologist_auxiliar_mail VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    clinic_id UUID REFERENCES clinics (clinic_id)
  );

CREATE TABLE
  available_times (
    slot_id SERIAL PRIMARY KEY,
    slot_start_time TIME NOT NULL,
    slot_end_time TIME NOT NULL,
    day_of_week SMALLINT NOT NULL CHECK (day_of_week BETWEEN 1 AND 7),
    provider_id UUID NOT NULL,
    provider_type INT NOT NULL,
    FOREIGN KEY (provider_type) REFERENCES user_roles (role_id)
  );

CREATE TABLE
  patients (
    patient_id UUID PRIMARY KEY,
    clinic_id UUID REFERENCES clinics (clinic_id),
    patient_name VARCHAR(255) NOT NULL,
    patient_mail VARCHAR(255) NOT NULL,
    patient_phone VARCHAR(25) NOT NULL,
    patient_cep VARCHAR(8) NOT NULL,
    patient_address VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

CREATE TABLE
  psychologist_patient_authorization (
    authorization_id UUID PRIMARY KEY,
    psychologist_id UUID REFERENCES psychologists (psychologist_id),
    patient_id UUID REFERENCES patients (patient_id),
    clinic_id UUID REFERENCES clinics (clinic_id),
    status INT REFERENCES status_types (status_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

CREATE TABLE
  psychologist_changelog (
    psychologist_change_id SERIAL PRIMARY KEY,
    psychologist_id UUID REFERENCES psychologists (psychologist_id),
    field_changed VARCHAR(255) NOT NULL,
    old_record TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID NOT NULL,
    updated_by_role INT NOT NULL REFERENCES user_roles (role_id)
  );

CREATE TABLE
  psychologist_patient_authorizations (
    authorization_id UUID PRIMARY KEY,
    psychologist_id UUID REFERENCES psychologists (psychologist_id),
    patient_id UUID REFERENCES patients (patient_id),
    authorized_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    authorized_by UUID REFERENCES clinics (clinic_id),
    authorization_status INT REFERENCES status_types (status_id)
  );

CREATE TABLE
  patient_anamnesis (
    anamnesis_id UUID PRIMARY KEY,
    patient_id UUID REFERENCES patients (patient_id),
    psychologist_id UUID REFERENCES psychologists (psychologist_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES psychologists (psychologist_id),
    marital_status VARCHAR(20),
    care_modality VARCHAR(10),
    gender VARCHAR(10),
    occupation VARCHAR(255),
    education_level VARCHAR(30),
    socioeconomic_level VARCHAR(60),
    special_needs VARCHAR(15),
    referred_by VARCHAR(50),
    undergoing_treatment TEXT,
    treatment_expectation TEXT,
    diagnosis TEXT,
    healthy_life_habits TEXT,
    relevant_information TEXT
  );

CREATE TABLE
  anamnesis_changelog (
    anamnesis_change_id SERIAL PRIMARY KEY,
    anamnesis_id UUID REFERENCES patient_anamnesis (anamnesis_id),
    old_record JSON NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID NOT NULL,
    updated_by_role INT NOT NULL REFERENCES user_roles (role_id)
  );

CREATE TABLE
  patient_closure (
    closure_id UUID PRIMARY KEY,
    patient_id UUID REFERENCES patients (patient_id),
    psychologist_id UUID REFERENCES psychologists (psychologist_id),
    case_status VARCHAR(100) NOT NULL,
    overall_results_evaluation INT,
    initial_expectations_met TEXT,
    treatment_duration_sessions INT,
    healthy_life_habits_acquired TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

CREATE TABLE
  patient_closure_changelog (
    closure_change_id SERIAL PRIMARY KEY,
    closure_id UUID REFERENCES patient_closure (closure_id),
    old_record JSON NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID NOT NULL,
    updated_by_role INT NOT NULL REFERENCES user_roles (role_id)
  );

CREATE TABLE
  offices (
    office_id SERIAL PRIMARY KEY,
    clinic_id UUID REFERENCES clinics (clinic_id),
    office_name VARCHAR(255) NOT NULL
  );

CREATE TABLE
  appointments (
    appointment_id UUID PRIMARY KEY,
    patient_id UUID REFERENCES patients (patient_id),
    psychologist_id UUID REFERENCES psychologists (psychologist_id),
    cotherapyst_id UUID REFERENCES psychologists (psychologist_id),
    office_id INT REFERENCES offices (office_id),
    duration INT NOT NULL,
    recurrence INT REFERENCES recurrence_options (recurrence_id),
    status INT REFERENCES appointment_status (appointment_status_id),
    appointment_date TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

CREATE TABLE
  evolutions (
    evolution_id UUID PRIMARY KEY,
    patient_id UUID REFERENCES patients (patient_id),
    psychologist_id UUID REFERENCES psychologists (psychologist_id),
    attendance_status INT NOT NULL,
    punctuality_status INT NOT NULL,
    arrival_mood_state INT NOT NULL,
    departure_mood_state INT NOT NULL,
    discussion_topic TEXT,
    analysis_intervention TEXT,
    next_session_plan TEXT,
    therapist_notes TEXT,
    evolution_status BOOLEAN NOT NULL,
    appointment_id UUID REFERENCES appointments (appointment_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    archive_id UUID REFERENCES archives (archive_id)
  );

CREATE TABLE
  evolution_changelog (
    evolution_change_id SERIAL PRIMARY KEY,
    evolution_id UUID REFERENCES evolutions (evolution_id),
    old_record JSON NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID NOT NULL,
    updated_by_role INT NOT NULL REFERENCES user_roles (role_id)
  );

CREATE TABLE
  medical_records (
    record_number VARCHAR(4) PRIMARY KEY CHECK (record_number ~ '^[A-Z][0-9][A-Z][0-9]$'),
    patient_id UUID REFERENCES patients (patient_id),
    psychologist_id UUID REFERENCES psychologists (psychologist_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status INT REFERENCES status_types (status_id),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );