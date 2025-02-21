SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 215 (class 1259 OID 16583)
-- Name: agendamentos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TYPE public.tipousuario_enum AS ENUM (
    'clinica',
    'psicologo_vinculado',
    'secretario_vinculado',
    'psicologo'
);


ALTER TYPE public.tipousuario_enum OWNER TO postgres;

CREATE TABLE public.agendamentos (
    agendamento_id integer NOT NULL,
    paciente_id integer NOT NULL,
    usuario_id integer NOT NULL,
    data_hora_inicio timestamp without time zone NOT NULL,
    status character varying(255) NOT NULL,
    notas_agendamento character varying(255),
    consultorio_id integer,
    data_hora_fim timestamp without time zone,
    historico text,
    recorrencia character varying(50),
    tipo_sessao integer,
    CONSTRAINT agendamentos_recorrencia_check CHECK (((recorrencia)::text = ANY (ARRAY[('Nenhuma'::character varying)::text, ('Semanal'::character varying)::text, ('Quinzenal'::character varying)::text, ('Mensal'::character varying)::text])))
);


ALTER TABLE public.agendamentos OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 16591)
-- Name: agendamentos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.agendamentos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.agendamentos_id_seq OWNER TO postgres;

--
-- TOC entry 5016 (class 0 OID 0)
-- Dependencies: 216
-- Name: agendamentos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.agendamentos_id_seq OWNED BY public.agendamentos.agendamento_id;


--
-- TOC entry 251 (class 1259 OID 16897)
-- Name: anamnesis; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.anamnesis (
    anamnesis_id integer NOT NULL,
    usuario_id integer NOT NULL,
    paciente_id integer NOT NULL,
    marital_status character varying(20),
    care_modality character varying(10),
    gender character varying(10),
    occupation character varying(255),
    education_level character varying(30),
    socioeconomic_level character varying(60),
    special_needs character varying(15),
    referred_by character varying(50),
    undergoing_treatment text,
    treatment_expectation text,
    diagnosis text,
    healthy_life_habits text,
    relevant_information text,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.anamnesis OWNER TO postgres;

--
-- TOC entry 259 (class 1259 OID 18070)
-- Name: anamnesis_changelog; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.anamnesis_changelog (
    anamnesis_change_id integer NOT NULL,
    anamnesis_id integer NOT NULL,
    old_record json NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    usuario_id integer NOT NULL
);


ALTER TABLE public.anamnesis_changelog OWNER TO postgres;

--
-- TOC entry 258 (class 1259 OID 18069)
-- Name: anamnesis_changelog_anamnesis_change_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.anamnesis_changelog_anamnesis_change_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.anamnesis_changelog_anamnesis_change_id_seq OWNER TO postgres;

--
-- TOC entry 5017 (class 0 OID 0)
-- Dependencies: 258
-- Name: anamnesis_changelog_anamnesis_change_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.anamnesis_changelog_anamnesis_change_id_seq OWNED BY public.anamnesis_changelog.anamnesis_change_id;


--
-- TOC entry 250 (class 1259 OID 16896)
-- Name: anamnesis_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.anamnesis_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.anamnesis_id_seq OWNER TO postgres;

--
-- TOC entry 5018 (class 0 OID 0)
-- Dependencies: 250
-- Name: anamnesis_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.anamnesis_id_seq OWNED BY public.anamnesis.anamnesis_id;


--
-- TOC entry 260 (class 1259 OID 18089)
-- Name: anamnesis_sign; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.anamnesis_sign (
    anamnesis_sign_id uuid NOT NULL,
    anamnesis_id integer NOT NULL,
    signed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    status boolean NOT NULL,
    usuario_id integer NOT NULL
);


ALTER TABLE public.anamnesis_sign OWNER TO postgres;

--
-- TOC entry 256 (class 1259 OID 18034)
-- Name: archives; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.archives (
    archive_id uuid NOT NULL,
    archive_name character varying(255) NOT NULL,
    archive_localization character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    archive_mime_type character varying(50) NOT NULL,
    evolution_id integer NOT NULL
);


ALTER TABLE public.archives OWNER TO postgres;

--
-- TOC entry 243 (class 1259 OID 16816)
-- Name: attended_options; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.attended_options (
    id integer NOT NULL,
    title character varying(255) NOT NULL
);


ALTER TABLE public.attended_options OWNER TO postgres;

--
-- TOC entry 242 (class 1259 OID 16815)
-- Name: attended_options_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.attended_options_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.attended_options_id_seq OWNER TO postgres;

--
-- TOC entry 5019 (class 0 OID 0)
-- Dependencies: 242
-- Name: attended_options_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.attended_options_id_seq OWNED BY public.attended_options.id;


--
-- TOC entry 217 (class 1259 OID 16592)
-- Name: autorizacoes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.autorizacoes (
    id_autorizacao integer NOT NULL,
    usuario_id integer,
    paciente_id integer,
    clinica_id integer,
    status character varying(50) NOT NULL,
    data_concessao timestamp without time zone,
    data_retirada timestamp without time zone
);


ALTER TABLE public.autorizacoes OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 16595)
-- Name: autorizacoes_id_autorizacao_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.autorizacoes_id_autorizacao_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.autorizacoes_id_autorizacao_seq OWNER TO postgres;

--
-- TOC entry 5020 (class 0 OID 0)
-- Dependencies: 218
-- Name: autorizacoes_id_autorizacao_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.autorizacoes_id_autorizacao_seq OWNED BY public.autorizacoes.id_autorizacao;


--
-- TOC entry 221 (class 1259 OID 16602)
-- Name: consultorios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.consultorios (
    consultorio_id integer NOT NULL,
    clinica_id integer NOT NULL,
    nome_consultorio character varying(255) NOT NULL,
    descricao text
);


ALTER TABLE public.consultorios OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16607)
-- Name: consultorios_consultorio_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.consultorios_consultorio_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.consultorios_consultorio_id_seq OWNER TO postgres;

--
-- TOC entry 5022 (class 0 OID 0)
-- Dependencies: 222
-- Name: consultorios_consultorio_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.consultorios_consultorio_id_seq OWNED BY public.consultorios.consultorio_id;




--
-- TOC entry 255 (class 1259 OID 18015)
-- Name: evolution_changelog; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.evolution_changelog (
    evolution_change_id integer NOT NULL,
    evolution_id integer NOT NULL,
    old_record json NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    usuario_id integer NOT NULL
);


ALTER TABLE public.evolution_changelog OWNER TO postgres;

--
-- TOC entry 254 (class 1259 OID 18014)
-- Name: evolution_changelog_evolution_change_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.evolution_changelog_evolution_change_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.evolution_changelog_evolution_change_id_seq OWNER TO postgres;

--
-- TOC entry 5024 (class 0 OID 0)
-- Dependencies: 254
-- Name: evolution_changelog_evolution_change_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.evolution_changelog_evolution_change_id_seq OWNED BY public.evolution_changelog.evolution_change_id;


--
-- TOC entry 257 (class 1259 OID 18047)
-- Name: evolution_sign; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.evolution_sign (
    evolution_sign_id uuid NOT NULL,
    evolution_id integer NOT NULL,
    signed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    status boolean NOT NULL,
    usuario_id integer NOT NULL
);


ALTER TABLE public.evolution_sign OWNER TO postgres;

--
-- TOC entry 249 (class 1259 OID 16837)
-- Name: evolutions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.evolutions (
    evolution_id integer NOT NULL,
    usuario_id integer NOT NULL,
    paciente_id integer NOT NULL,
    attendance_status integer,
    punctuality_status integer,
    arrival_mood_state integer,
    discussion_topic text,
    analysis_intervention text,
    next_session_plan text,
    departure_mood_state integer,
    therapist_notes text,
    evolution_status boolean DEFAULT false,
    agendamento_id integer,
    created_at timestamp without time zone,
    archive_id uuid
);


ALTER TABLE public.evolutions OWNER TO postgres;

--
-- TOC entry 248 (class 1259 OID 16836)
-- Name: evolutions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.evolutions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.evolutions_id_seq OWNER TO postgres;

--
-- TOC entry 5025 (class 0 OID 0)
-- Dependencies: 248
-- Name: evolutions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.evolutions_id_seq OWNED BY public.evolutions.evolution_id;


--
-- TOC entry 247 (class 1259 OID 16830)
-- Name: mood_states; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mood_states (
    id integer NOT NULL,
    value numeric(2,1) NOT NULL,
    title character varying(255) NOT NULL
);


ALTER TABLE public.mood_states OWNER TO postgres;

--
-- TOC entry 246 (class 1259 OID 16829)
-- Name: mood_states_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.mood_states_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.mood_states_id_seq OWNER TO postgres;

--
-- TOC entry 5027 (class 0 OID 0)
-- Dependencies: 246
-- Name: mood_states_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.mood_states_id_seq OWNED BY public.mood_states.id;


--
-- TOC entry 231 (class 1259 OID 16631)
-- Name: pacientes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pacientes (
    paciente_id integer NOT NULL,
    nome_paciente character varying(255) NOT NULL,
    data_nascimento_paciente date,
    telefone_paciente character varying(15),
    email_paciente character varying(255),
    cep_paciente character varying(10),
    endereco_paciente text,
    diagnostico text,
    historico_medico text,
    status_paciente character varying(10) DEFAULT 'ativo'::character varying,
    clinica_id integer,
    usuario_id integer NOT NULL,
    cpf_paciente character varying(18),
    inativado_por integer,
    CONSTRAINT check_diagnostico_length CHECK ((length(diagnostico) <= 5000)),
    CONSTRAINT check_historico_medico_length CHECK ((length(historico_medico) <= 5000))
);


ALTER TABLE public.pacientes OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 16639)
-- Name: pacientes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pacientes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pacientes_id_seq OWNER TO postgres;

--
-- TOC entry 5028 (class 0 OID 0)
-- Dependencies: 232
-- Name: pacientes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pacientes_id_seq OWNED BY public.pacientes.paciente_id;


--
-- TOC entry 253 (class 1259 OID 16917)
-- Name: patient_closure; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.patient_closure (
    patient_closure_id integer NOT NULL,
    usuario_id integer NOT NULL,
    paciente_id integer NOT NULL,
    case_status character varying(100),
    overall_results_evaluation integer,
    initial_expectations_met text,
    treatment_duration_sessions integer,
    healthy_life_habits_acquired text,
    additional_relevant_information text,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.patient_closure OWNER TO postgres;

--
-- TOC entry 262 (class 1259 OID 18106)
-- Name: patient_closure_changelog; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.patient_closure_changelog (
    patient_closure_change_id integer NOT NULL,
    patient_closure_id integer NOT NULL,
    old_record json NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    usuario_id integer NOT NULL
);


ALTER TABLE public.patient_closure_changelog OWNER TO postgres;

--
-- TOC entry 261 (class 1259 OID 18105)
-- Name: patient_closure_changelog_patient_closure_change_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.patient_closure_changelog_patient_closure_change_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.patient_closure_changelog_patient_closure_change_id_seq OWNER TO postgres;

--
-- TOC entry 5029 (class 0 OID 0)
-- Dependencies: 261
-- Name: patient_closure_changelog_patient_closure_change_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.patient_closure_changelog_patient_closure_change_id_seq OWNED BY public.patient_closure_changelog.patient_closure_change_id;


--
-- TOC entry 252 (class 1259 OID 16916)
-- Name: patient_closure_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.patient_closure_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.patient_closure_id_seq OWNER TO postgres;

--
-- TOC entry 5030 (class 0 OID 0)
-- Dependencies: 252
-- Name: patient_closure_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.patient_closure_id_seq OWNED BY public.patient_closure.patient_closure_id;


--
-- TOC entry 263 (class 1259 OID 18125)
-- Name: patient_closure_sign; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.patient_closure_sign (
    patient_closure_sign_id uuid NOT NULL,
    patient_closure_id integer NOT NULL,
    signed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    status boolean NOT NULL,
    usuario_id integer NOT NULL
);


ALTER TABLE public.patient_closure_sign OWNER TO postgres;

--
-- TOC entry 264 (class 1259 OID 18666)
-- Name: payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payments (
    payment_id uuid NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    payment_status character varying(255),
    payment_code text,
    payment_url text,
    payment_qr_code text,
    paciente_id integer NOT NULL,
    clinica_id integer NOT NULL,
    updated_at timestamp without time zone,
    price integer DEFAULT 20,
    mercado_id integer NOT NULL,
    psicologo_id integer,
    expires_in timestamp without time zone
);


ALTER TABLE public.payments OWNER TO postgres;

--
-- TOC entry 245 (class 1259 OID 16823)
-- Name: punctuality_options; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.punctuality_options (
    id integer NOT NULL,
    title character varying(255) NOT NULL
);


ALTER TABLE public.punctuality_options OWNER TO postgres;

--
-- TOC entry 244 (class 1259 OID 16822)
-- Name: punctuality_options_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.punctuality_options_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.punctuality_options_id_seq OWNER TO postgres;

--
-- TOC entry 5031 (class 0 OID 0)
-- Dependencies: 244
-- Name: punctuality_options_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.punctuality_options_id_seq OWNED BY public.punctuality_options.id;


--
-- TOC entry 240 (class 1259 OID 16663)
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    usuario_id integer NOT NULL,
    nome_usuario character varying(255) NOT NULL,
    email_usuario character varying(255) NOT NULL,
    senha character varying(255) NOT NULL,
    clinica_id integer,
    tipousuario public.tipousuario_enum DEFAULT 'psicologo'::public.tipousuario_enum,
    cpfcnpj character varying(18),
    data_nascimento_usuario date,
    telefone_usuario character varying(15),
    cep_usuario character varying(10),
    endereco_usuario character varying(255),
    qualificacoes text,
    registro_profissional character varying(50),
    status_usuario character varying(50) DEFAULT 'ativo'::character varying,
    first_access uuid,
    email_auxiliar character varying(255),
    start_hour time without time zone DEFAULT '07:00:00'::time without time zone,
    end_hour time without time zone DEFAULT '22:00:00'::time without time zone,
    monthly_fee integer NULL DEFAULT '20',
    expires_in_day integer NULL DEFAULT '10'
);


ALTER TABLE public.usuarios OWNER TO postgres;

--
-- TOC entry 241 (class 1259 OID 16670)
-- Name: usuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuarios_id_seq OWNER TO postgres;

--
-- TOC entry 5032 (class 0 OID 0)
-- Dependencies: 241
-- Name: usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.usuario_id;


--
-- TOC entry 4737 (class 2604 OID 16671)
-- Name: agendamentos agendamento_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agendamentos ALTER COLUMN agendamento_id SET DEFAULT nextval('public.agendamentos_id_seq'::regclass);


--
-- TOC entry 4755 (class 2604 OID 16900)
-- Name: anamnesis anamnesis_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.anamnesis ALTER COLUMN anamnesis_id SET DEFAULT nextval('public.anamnesis_id_seq'::regclass);


--
-- TOC entry 4763 (class 2604 OID 18073)
-- Name: anamnesis_changelog anamnesis_change_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.anamnesis_changelog ALTER COLUMN anamnesis_change_id SET DEFAULT nextval('public.anamnesis_changelog_anamnesis_change_id_seq'::regclass);


--
-- TOC entry 4750 (class 2604 OID 16819)
-- Name: attended_options id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attended_options ALTER COLUMN id SET DEFAULT nextval('public.attended_options_id_seq'::regclass);


--
-- TOC entry 4738 (class 2604 OID 16672)
-- Name: autorizacoes id_autorizacao; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.autorizacoes ALTER COLUMN id_autorizacao SET DEFAULT nextval('public.autorizacoes_id_autorizacao_seq'::regclass);


--
-- TOC entry 4740 (class 2604 OID 16674)
-- Name: consultorios consultorio_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.consultorios ALTER COLUMN consultorio_id SET DEFAULT nextval('public.consultorios_consultorio_id_seq'::regclass);


--
-- TOC entry 4759 (class 2604 OID 18018)
-- Name: evolution_changelog evolution_change_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evolution_changelog ALTER COLUMN evolution_change_id SET DEFAULT nextval('public.evolution_changelog_evolution_change_id_seq'::regclass);


--
-- TOC entry 4753 (class 2604 OID 16840)
-- Name: evolutions evolution_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evolutions ALTER COLUMN evolution_id SET DEFAULT nextval('public.evolutions_id_seq'::regclass);


--
-- TOC entry 4752 (class 2604 OID 16833)
-- Name: mood_states id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mood_states ALTER COLUMN id SET DEFAULT nextval('public.mood_states_id_seq'::regclass);


--
-- TOC entry 4743 (class 2604 OID 16679)
-- Name: pacientes paciente_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pacientes ALTER COLUMN paciente_id SET DEFAULT nextval('public.pacientes_id_seq'::regclass);


--
-- TOC entry 4757 (class 2604 OID 16920)
-- Name: patient_closure patient_closure_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patient_closure ALTER COLUMN patient_closure_id SET DEFAULT nextval('public.patient_closure_id_seq'::regclass);


--
-- TOC entry 4766 (class 2604 OID 18109)
-- Name: patient_closure_changelog patient_closure_change_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patient_closure_changelog ALTER COLUMN patient_closure_change_id SET DEFAULT nextval('public.patient_closure_changelog_patient_closure_change_id_seq'::regclass);


--
-- TOC entry 4751 (class 2604 OID 16826)
-- Name: punctuality_options id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.punctuality_options ALTER COLUMN id SET DEFAULT nextval('public.punctuality_options_id_seq'::regclass);


--
-- TOC entry 4745 (class 2604 OID 16683)
-- Name: usuarios usuario_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN usuario_id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);


--
-- TOC entry 4775 (class 2606 OID 16685)
-- Name: agendamentos agendamentos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agendamentos
    ADD CONSTRAINT agendamentos_pkey PRIMARY KEY (agendamento_id);


--
-- TOC entry 4821 (class 2606 OID 18078)
-- Name: anamnesis_changelog anamnesis_changelog_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.anamnesis_changelog
    ADD CONSTRAINT anamnesis_changelog_pkey PRIMARY KEY (anamnesis_change_id);


--
-- TOC entry 4811 (class 2606 OID 16904)
-- Name: anamnesis anamnesis_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.anamnesis
    ADD CONSTRAINT anamnesis_pkey PRIMARY KEY (anamnesis_id);


--
-- TOC entry 4823 (class 2606 OID 18094)
-- Name: anamnesis_sign anamnesis_sign_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.anamnesis_sign
    ADD CONSTRAINT anamnesis_sign_pkey PRIMARY KEY (anamnesis_sign_id);


--
-- TOC entry 4817 (class 2606 OID 18041)
-- Name: archives archives_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.archives
    ADD CONSTRAINT archives_pkey PRIMARY KEY (archive_id);


--
-- TOC entry 4801 (class 2606 OID 16821)
-- Name: attended_options attended_options_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attended_options
    ADD CONSTRAINT attended_options_pkey PRIMARY KEY (id);


--
-- TOC entry 4777 (class 2606 OID 16687)
-- Name: autorizacoes autorizacoes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.autorizacoes
    ADD CONSTRAINT autorizacoes_pkey PRIMARY KEY (id_autorizacao);


--
-- TOC entry 4783 (class 2606 OID 16691)
-- Name: consultorios consultorios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.consultorios
    ADD CONSTRAINT consultorios_pkey PRIMARY KEY (consultorio_id);



--
-- TOC entry 4793 (class 2606 OID 16697)
-- Name: usuarios email_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT email_unique UNIQUE (email_usuario);


--
-- TOC entry 4815 (class 2606 OID 18023)
-- Name: evolution_changelog evolution_changelog_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evolution_changelog
    ADD CONSTRAINT evolution_changelog_pkey PRIMARY KEY (evolution_change_id);


--
-- TOC entry 4819 (class 2606 OID 18052)
-- Name: evolution_sign evolution_sign_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evolution_sign
    ADD CONSTRAINT evolution_sign_pkey PRIMARY KEY (evolution_sign_id);


--
-- TOC entry 4807 (class 2606 OID 16864)
-- Name: evolutions evolutions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evolutions
    ADD CONSTRAINT evolutions_pkey PRIMARY KEY (evolution_id);

--
-- TOC entry 4805 (class 2606 OID 16835)
-- Name: mood_states mood_states_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mood_states
    ADD CONSTRAINT mood_states_pkey PRIMARY KEY (id);


--
-- TOC entry 4791 (class 2606 OID 16705)
-- Name: pacientes pacientes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pacientes
    ADD CONSTRAINT pacientes_pkey PRIMARY KEY (paciente_id);


--
-- TOC entry 4825 (class 2606 OID 18114)
-- Name: patient_closure_changelog patient_closure_changelog_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patient_closure_changelog
    ADD CONSTRAINT patient_closure_changelog_pkey PRIMARY KEY (patient_closure_change_id);


--
-- TOC entry 4813 (class 2606 OID 16925)
-- Name: patient_closure patient_closure_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patient_closure
    ADD CONSTRAINT patient_closure_pkey PRIMARY KEY (patient_closure_id);


--
-- TOC entry 4827 (class 2606 OID 18130)
-- Name: patient_closure_sign patient_closure_sign_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patient_closure_sign
    ADD CONSTRAINT patient_closure_sign_pkey PRIMARY KEY (patient_closure_sign_id);


--
-- TOC entry 4829 (class 2606 OID 18673)
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (payment_id);


--
-- TOC entry 4803 (class 2606 OID 16828)
-- Name: punctuality_options punctuality_options_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.punctuality_options
    ADD CONSTRAINT punctuality_options_pkey PRIMARY KEY (id);


--
-- TOC entry 4809 (class 2606 OID 16942)
-- Name: evolutions unique_agendamento_id; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evolutions
    ADD CONSTRAINT unique_agendamento_id UNIQUE (agendamento_id);


--
-- TOC entry 4795 (class 2606 OID 16717)
-- Name: usuarios unique_usuario_id; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT unique_usuario_id UNIQUE (usuario_id);


--
-- TOC entry 4779 (class 2606 OID 18012)
-- Name: autorizacoes unique_vinculo; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.autorizacoes
    ADD CONSTRAINT unique_vinculo UNIQUE (usuario_id, paciente_id, clinica_id);


--
-- TOC entry 4797 (class 2606 OID 16719)
-- Name: usuarios usuarios_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_email_key UNIQUE (email_usuario);


--
-- TOC entry 4799 (class 2606 OID 16721)
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (usuario_id);


--
-- TOC entry 4830 (class 2606 OID 16723)
-- Name: agendamentos agendamentos_consultorio_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agendamentos
    ADD CONSTRAINT agendamentos_consultorio_id_fkey FOREIGN KEY (consultorio_id) REFERENCES public.consultorios(consultorio_id);


--
-- TOC entry 4831 (class 2606 OID 16728)
-- Name: agendamentos agendamentos_paciente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agendamentos
    ADD CONSTRAINT agendamentos_paciente_id_fkey FOREIGN KEY (paciente_id) REFERENCES public.pacientes(paciente_id);


--
-- TOC entry 4832 (class 2606 OID 16733)
-- Name: agendamentos agendamentos_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agendamentos
    ADD CONSTRAINT agendamentos_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(usuario_id);


--
-- TOC entry 4856 (class 2606 OID 18079)
-- Name: anamnesis_changelog anamnesis_changelog_anamnesis_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.anamnesis_changelog
    ADD CONSTRAINT anamnesis_changelog_anamnesis_id_fkey FOREIGN KEY (anamnesis_id) REFERENCES public.anamnesis(anamnesis_id);


--
-- TOC entry 4857 (class 2606 OID 18084)
-- Name: anamnesis_changelog anamnesis_changelog_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.anamnesis_changelog
    ADD CONSTRAINT anamnesis_changelog_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(usuario_id);


--
-- TOC entry 4848 (class 2606 OID 16910)
-- Name: anamnesis anamnesis_paciente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.anamnesis
    ADD CONSTRAINT anamnesis_paciente_id_fkey FOREIGN KEY (paciente_id) REFERENCES public.pacientes(paciente_id);


--
-- TOC entry 4858 (class 2606 OID 18095)
-- Name: anamnesis_sign anamnesis_sign_anamnesis_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.anamnesis_sign
    ADD CONSTRAINT anamnesis_sign_anamnesis_id_fkey FOREIGN KEY (anamnesis_id) REFERENCES public.anamnesis(anamnesis_id);


--
-- TOC entry 4859 (class 2606 OID 18100)
-- Name: anamnesis_sign anamnesis_sign_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.anamnesis_sign
    ADD CONSTRAINT anamnesis_sign_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(usuario_id);


--
-- TOC entry 4849 (class 2606 OID 16905)
-- Name: anamnesis anamnesis_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.anamnesis
    ADD CONSTRAINT anamnesis_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(usuario_id);


--
-- TOC entry 4833 (class 2606 OID 16738)
-- Name: autorizacoes autorizacoes_clinica_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.autorizacoes
    ADD CONSTRAINT autorizacoes_clinica_id_fkey FOREIGN KEY (clinica_id) REFERENCES public.usuarios(usuario_id);


--
-- TOC entry 4834 (class 2606 OID 16743)
-- Name: autorizacoes autorizacoes_paciente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.autorizacoes
    ADD CONSTRAINT autorizacoes_paciente_id_fkey FOREIGN KEY (paciente_id) REFERENCES public.pacientes(paciente_id);


--
-- TOC entry 4835 (class 2606 OID 16748)
-- Name: autorizacoes autorizacoes_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.autorizacoes
    ADD CONSTRAINT autorizacoes_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(usuario_id);


--
-- TOC entry 4836 (class 2606 OID 16753)
-- Name: consultorios consultorios_clinica_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.consultorios
    ADD CONSTRAINT consultorios_clinica_id_fkey FOREIGN KEY (clinica_id) REFERENCES public.usuarios(usuario_id);


--
-- TOC entry 4852 (class 2606 OID 18024)
-- Name: evolution_changelog evolution_changelog_evolution_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evolution_changelog
    ADD CONSTRAINT evolution_changelog_evolution_id_fkey FOREIGN KEY (evolution_id) REFERENCES public.evolutions(evolution_id);


--
-- TOC entry 4853 (class 2606 OID 18029)
-- Name: evolution_changelog evolution_changelog_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evolution_changelog
    ADD CONSTRAINT evolution_changelog_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(usuario_id);


--
-- TOC entry 4854 (class 2606 OID 18053)
-- Name: evolution_sign evolution_sign_evolution_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evolution_sign
    ADD CONSTRAINT evolution_sign_evolution_id_fkey FOREIGN KEY (evolution_id) REFERENCES public.evolutions(evolution_id);


--
-- TOC entry 4855 (class 2606 OID 18058)
-- Name: evolution_sign evolution_sign_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evolution_sign
    ADD CONSTRAINT evolution_sign_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(usuario_id);


--
-- TOC entry 4840 (class 2606 OID 18063)
-- Name: evolutions evolutions_archive_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evolutions
    ADD CONSTRAINT evolutions_archive_id_fkey FOREIGN KEY (archive_id) REFERENCES public.archives(archive_id) ON DELETE SET NULL;


--
-- TOC entry 4841 (class 2606 OID 16853)
-- Name: evolutions evolutions_arrival_mood_state_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evolutions
    ADD CONSTRAINT evolutions_arrival_mood_state_fkey FOREIGN KEY (arrival_mood_state) REFERENCES public.mood_states(id);


--
-- TOC entry 4842 (class 2606 OID 16843)
-- Name: evolutions evolutions_attendance_status_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evolutions
    ADD CONSTRAINT evolutions_attendance_status_fkey FOREIGN KEY (attendance_status) REFERENCES public.attended_options(id);


--
-- TOC entry 4843 (class 2606 OID 16858)
-- Name: evolutions evolutions_departure_mood_state_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evolutions
    ADD CONSTRAINT evolutions_departure_mood_state_fkey FOREIGN KEY (departure_mood_state) REFERENCES public.mood_states(id);


--
-- TOC entry 4844 (class 2606 OID 16870)
-- Name: evolutions evolutions_paciente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evolutions
    ADD CONSTRAINT evolutions_paciente_id_fkey FOREIGN KEY (paciente_id) REFERENCES public.pacientes(paciente_id);


--
-- TOC entry 4845 (class 2606 OID 16848)
-- Name: evolutions evolutions_punctuality_status_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evolutions
    ADD CONSTRAINT evolutions_punctuality_status_fkey FOREIGN KEY (punctuality_status) REFERENCES public.punctuality_options(id);


--
-- TOC entry 4846 (class 2606 OID 16865)
-- Name: evolutions evolutions_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evolutions
    ADD CONSTRAINT evolutions_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(usuario_id);


--
-- TOC entry 4847 (class 2606 OID 16936)
-- Name: evolutions fk_agendamento; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evolutions
    ADD CONSTRAINT fk_agendamento FOREIGN KEY (agendamento_id) REFERENCES public.agendamentos(agendamento_id);


--
-- TOC entry 4839 (class 2606 OID 16778)
-- Name: pacientes pacientes_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pacientes
    ADD CONSTRAINT pacientes_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(usuario_id);


--
-- TOC entry 4860 (class 2606 OID 18115)
-- Name: patient_closure_changelog patient_closure_changelog_patient_closure_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patient_closure_changelog
    ADD CONSTRAINT patient_closure_changelog_patient_closure_id_fkey FOREIGN KEY (patient_closure_id) REFERENCES public.patient_closure(patient_closure_id);


--
-- TOC entry 4861 (class 2606 OID 18120)
-- Name: patient_closure_changelog patient_closure_changelog_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patient_closure_changelog
    ADD CONSTRAINT patient_closure_changelog_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(usuario_id);


--
-- TOC entry 4850 (class 2606 OID 16931)
-- Name: patient_closure patient_closure_paciente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patient_closure
    ADD CONSTRAINT patient_closure_paciente_id_fkey FOREIGN KEY (paciente_id) REFERENCES public.pacientes(paciente_id);


--
-- TOC entry 4862 (class 2606 OID 18131)
-- Name: patient_closure_sign patient_closure_sign_patient_closure_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patient_closure_sign
    ADD CONSTRAINT patient_closure_sign_patient_closure_id_fkey FOREIGN KEY (patient_closure_id) REFERENCES public.patient_closure(patient_closure_id);


--
-- TOC entry 4863 (class 2606 OID 18136)
-- Name: patient_closure_sign patient_closure_sign_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patient_closure_sign
    ADD CONSTRAINT patient_closure_sign_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(usuario_id);


--
-- TOC entry 4851 (class 2606 OID 16926)
-- Name: patient_closure patient_closure_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patient_closure
    ADD CONSTRAINT patient_closure_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(usuario_id);


--
-- TOC entry 4864 (class 2606 OID 18679)
-- Name: payments payments_clinicas_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_clinicas_fk FOREIGN KEY (clinica_id) REFERENCES public.usuarios(usuario_id) ON DELETE CASCADE;


--
-- TOC entry 4865 (class 2606 OID 18674)
-- Name: payments payments_pacientes_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pacientes_fk FOREIGN KEY (paciente_id) REFERENCES public.pacientes(paciente_id) ON DELETE SET NULL;


--
-- TOC entry 4866 (class 2606 OID 18698)
-- Name: payments payments_psicologos_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_psicologos_fk FOREIGN KEY (psicologo_id) REFERENCES public.usuarios(usuario_id);

CREATE TABLE
  public.clinic_messages (
    message_id serial NOT NULL,
    created_at timestamp without time zone NOT NULL DEFAULT now(),
    updated_at timestamp without time zone NULL DEFAULT now(),
    subject character varying(255) NULL,
    message text NULL,
    clinic_id integer NOT NULL,
    usuario_id integer NULL
  );

ALTER TABLE
  public.clinic_messages
ADD
  CONSTRAINT clinic_messages_pkey PRIMARY KEY (message_id);


CREATE TABLE
  public.clinic_details (
    clinic_id integer NOT NULL,
    nome_coordenador character varying(255) NOT NULL,
    email_coordenador character varying(255) NULL,
    telefone_coordenador character varying(15) NULL,
    cpf_coordenador character varying(14) NULL
  );

ALTER TABLE
  "public"."clinic_details"
ADD
  CONSTRAINT "clinic_details_usuarios_pk" FOREIGN KEY ("clinic_id") REFERENCES "public"."usuarios" ("usuario_id") ON UPDATE NO ACTION ON DELETE NO ACTION;

-- Completed on 2024-11-19 13:55:39

--
-- PostgreSQL database dump complete
--

