--
-- PostgreSQL database dump
--

-- Dumped from database version 15.4
-- Dumped by pg_dump version 15.4

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

--
-- Name: tipousuario_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.tipousuario_enum AS ENUM (
    'clinica',
    'psicologo_vinculado',
    'secretario_vinculado',
    'psicologo'
);


ALTER TYPE public.tipousuario_enum OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: agendamentos; Type: TABLE; Schema: public; Owner: postgres
--

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
    tipo_sessao character varying(10) DEFAULT '1h'::character varying,
    recorrencia character varying(50),
    CONSTRAINT agendamentos_recorrencia_check CHECK (((recorrencia)::text = ANY ((ARRAY['Nenhuma'::character varying, 'Semanal'::character varying, 'Quinzenal'::character varying, 'Mensal'::character varying])::text[]))),
    CONSTRAINT agendamentos_tipo_sessao_check CHECK (((tipo_sessao)::text = ANY ((ARRAY['30min'::character varying, '1h'::character varying, '1h30min'::character varying, '2h'::character varying])::text[])))
);


ALTER TABLE public.agendamentos OWNER TO postgres;

--
-- Name: agendamentos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.agendamentos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.agendamentos_id_seq OWNER TO postgres;

--
-- Name: agendamentos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.agendamentos_id_seq OWNED BY public.agendamentos.agendamento_id;


--
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
-- Name: autorizacoes_id_autorizacao_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.autorizacoes_id_autorizacao_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.autorizacoes_id_autorizacao_seq OWNER TO postgres;

--
-- Name: autorizacoes_id_autorizacao_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.autorizacoes_id_autorizacao_seq OWNED BY public.autorizacoes.id_autorizacao;


--
-- Name: clinicas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.clinicas (
    id integer NOT NULL,
    nome character varying(255) NOT NULL,
    endereco text,
    telefone character varying(50),
    email character varying(255),
    cpfcnpj character varying(50),
    cep character varying(50),
    tipousuario character varying(50)
);


ALTER TABLE public.clinicas OWNER TO postgres;

--
-- Name: clinicas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.clinicas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.clinicas_id_seq OWNER TO postgres;

--
-- Name: clinicas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.clinicas_id_seq OWNED BY public.clinicas.id;


--
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
-- Name: consultorios_consultorio_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.consultorios_consultorio_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.consultorios_consultorio_id_seq OWNER TO postgres;

--
-- Name: consultorios_consultorio_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.consultorios_consultorio_id_seq OWNED BY public.consultorios.consultorio_id;


--
-- Name: cursos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cursos (
    id integer NOT NULL,
    titulo character varying(255) NOT NULL,
    descricao text,
    data_conclusao date,
    horas_curso integer
);


ALTER TABLE public.cursos OWNER TO postgres;

--
-- Name: cursos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cursos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.cursos_id_seq OWNER TO postgres;

--
-- Name: cursos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cursos_id_seq OWNED BY public.cursos.id;


--
-- Name: disponibilidade_psicologos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.disponibilidade_psicologos (
    disponibilidade_id integer NOT NULL,
    usuario_id integer NOT NULL,
    dia_semana character varying(10) NOT NULL,
    hora_inicio time without time zone NOT NULL,
    hora_fim time without time zone NOT NULL,
    CONSTRAINT chk_hora CHECK ((hora_inicio < hora_fim)),
    CONSTRAINT disponibilidade_psicologos_dia_semana_check CHECK (((dia_semana)::text = ANY ((ARRAY['Domingo'::character varying, 'Segunda'::character varying, 'Ter‡a'::character varying, 'Quarta'::character varying, 'Quinta'::character varying, 'Sexta'::character varying, 'S bado'::character varying])::text[])))
);


ALTER TABLE public.disponibilidade_psicologos OWNER TO postgres;

--
-- Name: disponibilidade_psicologos_disponibilidade_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.disponibilidade_psicologos_disponibilidade_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.disponibilidade_psicologos_disponibilidade_id_seq OWNER TO postgres;

--
-- Name: disponibilidade_psicologos_disponibilidade_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.disponibilidade_psicologos_disponibilidade_id_seq OWNED BY public.disponibilidade_psicologos.disponibilidade_id;


--
-- Name: linked_psychologists; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.linked_psychologists (
    id integer NOT NULL,
    clinica_id integer,
    psychologist_id integer
);


ALTER TABLE public.linked_psychologists OWNER TO postgres;

--
-- Name: linked_psychologists_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.linked_psychologists_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.linked_psychologists_id_seq OWNER TO postgres;

--
-- Name: linked_psychologists_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.linked_psychologists_id_seq OWNED BY public.linked_psychologists.id;


--
-- Name: notificacoes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notificacoes (
    notificacao_id integer NOT NULL,
    agendamento_id integer,
    tipo character varying(20),
    email_destinatario character varying(255) NOT NULL,
    data_hora_envio timestamp without time zone DEFAULT now(),
    status character varying(20),
    CONSTRAINT notificacoes_status_check CHECK (((status)::text = ANY ((ARRAY['enviado'::character varying, 'falhou'::character varying, 'aguardando'::character varying])::text[]))),
    CONSTRAINT notificacoes_tipo_check CHECK (((tipo)::text = ANY ((ARRAY['agendamento'::character varying, 'cancelamento'::character varying, 'reagendamento'::character varying])::text[])))
);


ALTER TABLE public.notificacoes OWNER TO postgres;

--
-- Name: notificacoes_notificacao_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notificacoes_notificacao_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.notificacoes_notificacao_id_seq OWNER TO postgres;

--
-- Name: notificacoes_notificacao_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notificacoes_notificacao_id_seq OWNED BY public.notificacoes.notificacao_id;


--
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
-- Name: pacientes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pacientes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.pacientes_id_seq OWNER TO postgres;

--
-- Name: pacientes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pacientes_id_seq OWNED BY public.pacientes.paciente_id;


--
-- Name: participantes_cursos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.participantes_cursos (
    curso_id integer NOT NULL,
    psicologo_id integer NOT NULL
);


ALTER TABLE public.participantes_cursos OWNER TO postgres;

--
-- Name: prontuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.prontuarios (
    prontuario_id integer NOT NULL,
    paciente_id integer NOT NULL,
    data_prontuario timestamp without time zone DEFAULT now() NOT NULL,
    notas_sessao text,
    status_prontuario character varying(10) DEFAULT 'ativo'::character varying,
    clinica_id integer,
    usuario_id integer NOT NULL,
    data_hora_agendamento timestamp without time zone
);


ALTER TABLE public.prontuarios OWNER TO postgres;

--
-- Name: prontuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.prontuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.prontuarios_id_seq OWNER TO postgres;

--
-- Name: prontuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.prontuarios_id_seq OWNED BY public.prontuarios.prontuario_id;


--
-- Name: psicologos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.psicologos (
    id integer NOT NULL,
    cpf character varying(11) DEFAULT '00000000000'::character varying NOT NULL,
    nome character varying(255) NOT NULL,
    telefone character varying(20),
    email character varying(255),
    qualificacoes text,
    horarios_disponiveis text,
    status character varying(10) DEFAULT 'ativo'::character varying,
    crp character varying(20),
    clinica_id integer
);


ALTER TABLE public.psicologos OWNER TO postgres;

--
-- Name: psicologos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.psicologos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.psicologos_id_seq OWNER TO postgres;

--
-- Name: psicologos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.psicologos_id_seq OWNED BY public.psicologos.id;


--
-- Name: reset_password_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reset_password_tokens (
    id integer NOT NULL,
    user_id integer,
    token character varying(255) NOT NULL,
    expires_at timestamp without time zone NOT NULL
);


ALTER TABLE public.reset_password_tokens OWNER TO postgres;

--
-- Name: reset_password_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reset_password_tokens_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.reset_password_tokens_id_seq OWNER TO postgres;

--
-- Name: reset_password_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.reset_password_tokens_id_seq OWNED BY public.reset_password_tokens.id;


--
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
    horarios_disponiveis text,
    registro_profissional character varying(50),
    status_usuario character varying(50) DEFAULT 'ativo'::character varying
);


ALTER TABLE public.usuarios OWNER TO postgres;

--
-- Name: usuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.usuarios_id_seq OWNER TO postgres;

--
-- Name: usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.usuario_id;


--
-- Name: agendamentos agendamento_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agendamentos ALTER COLUMN agendamento_id SET DEFAULT nextval('public.agendamentos_id_seq'::regclass);


--
-- Name: autorizacoes id_autorizacao; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.autorizacoes ALTER COLUMN id_autorizacao SET DEFAULT nextval('public.autorizacoes_id_autorizacao_seq'::regclass);


--
-- Name: clinicas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clinicas ALTER COLUMN id SET DEFAULT nextval('public.clinicas_id_seq'::regclass);


--
-- Name: consultorios consultorio_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.consultorios ALTER COLUMN consultorio_id SET DEFAULT nextval('public.consultorios_consultorio_id_seq'::regclass);


--
-- Name: cursos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cursos ALTER COLUMN id SET DEFAULT nextval('public.cursos_id_seq'::regclass);


--
-- Name: disponibilidade_psicologos disponibilidade_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.disponibilidade_psicologos ALTER COLUMN disponibilidade_id SET DEFAULT nextval('public.disponibilidade_psicologos_disponibilidade_id_seq'::regclass);


--
-- Name: linked_psychologists id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.linked_psychologists ALTER COLUMN id SET DEFAULT nextval('public.linked_psychologists_id_seq'::regclass);


--
-- Name: notificacoes notificacao_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notificacoes ALTER COLUMN notificacao_id SET DEFAULT nextval('public.notificacoes_notificacao_id_seq'::regclass);


--
-- Name: pacientes paciente_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pacientes ALTER COLUMN paciente_id SET DEFAULT nextval('public.pacientes_id_seq'::regclass);


--
-- Name: prontuarios prontuario_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prontuarios ALTER COLUMN prontuario_id SET DEFAULT nextval('public.prontuarios_id_seq'::regclass);


--
-- Name: psicologos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.psicologos ALTER COLUMN id SET DEFAULT nextval('public.psicologos_id_seq'::regclass);


--
-- Name: reset_password_tokens id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reset_password_tokens ALTER COLUMN id SET DEFAULT nextval('public.reset_password_tokens_id_seq'::regclass);


--
-- Name: usuarios usuario_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN usuario_id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);

--
-- Name: agendamentos agendamentos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agendamentos
    ADD CONSTRAINT agendamentos_pkey PRIMARY KEY (agendamento_id);


--
-- Name: autorizacoes autorizacoes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.autorizacoes
    ADD CONSTRAINT autorizacoes_pkey PRIMARY KEY (id_autorizacao);


--
-- Name: clinicas clinicas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clinicas
    ADD CONSTRAINT clinicas_pkey PRIMARY KEY (id);


--
-- Name: consultorios consultorios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.consultorios
    ADD CONSTRAINT consultorios_pkey PRIMARY KEY (consultorio_id);


--
-- Name: cursos cursos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cursos
    ADD CONSTRAINT cursos_pkey PRIMARY KEY (id);


--
-- Name: disponibilidade_psicologos disponibilidade_psicologos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.disponibilidade_psicologos
    ADD CONSTRAINT disponibilidade_psicologos_pkey PRIMARY KEY (disponibilidade_id);


--
-- Name: usuarios email_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT email_unique UNIQUE (email_usuario);


--
-- Name: linked_psychologists linked_psychologists_clinica_id_psychologist_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.linked_psychologists
    ADD CONSTRAINT linked_psychologists_clinica_id_psychologist_id_key UNIQUE (clinica_id, psychologist_id);


--
-- Name: linked_psychologists linked_psychologists_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.linked_psychologists
    ADD CONSTRAINT linked_psychologists_pkey PRIMARY KEY (id);


--
-- Name: notificacoes notificacoes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notificacoes
    ADD CONSTRAINT notificacoes_pkey PRIMARY KEY (notificacao_id);


--
-- Name: pacientes pacientes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pacientes
    ADD CONSTRAINT pacientes_pkey PRIMARY KEY (paciente_id);


--
-- Name: participantes_cursos participantes_cursos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.participantes_cursos
    ADD CONSTRAINT participantes_cursos_pkey PRIMARY KEY (curso_id, psicologo_id);


--
-- Name: prontuarios prontuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prontuarios
    ADD CONSTRAINT prontuarios_pkey PRIMARY KEY (prontuario_id);


--
-- Name: psicologos psicologos_cpf_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.psicologos
    ADD CONSTRAINT psicologos_cpf_key UNIQUE (cpf);


--
-- Name: psicologos psicologos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.psicologos
    ADD CONSTRAINT psicologos_pkey PRIMARY KEY (id);


--
-- Name: reset_password_tokens reset_password_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reset_password_tokens
    ADD CONSTRAINT reset_password_tokens_pkey PRIMARY KEY (id);


--
-- Name: usuarios unique_usuario_id; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT unique_usuario_id UNIQUE (usuario_id);


--
-- Name: usuarios usuarios_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_email_key UNIQUE (email_usuario);


--
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (usuario_id);


--
-- Name: idx_psicologos_cpf; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_psicologos_cpf ON public.psicologos USING btree (cpf);


--
-- Name: agendamentos agendamentos_consultorio_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agendamentos
    ADD CONSTRAINT agendamentos_consultorio_id_fkey FOREIGN KEY (consultorio_id) REFERENCES public.consultorios(consultorio_id);


--
-- Name: agendamentos agendamentos_paciente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agendamentos
    ADD CONSTRAINT agendamentos_paciente_id_fkey FOREIGN KEY (paciente_id) REFERENCES public.pacientes(paciente_id);


--
-- Name: agendamentos agendamentos_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agendamentos
    ADD CONSTRAINT agendamentos_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(usuario_id);


--
-- Name: autorizacoes autorizacoes_clinica_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.autorizacoes
    ADD CONSTRAINT autorizacoes_clinica_id_fkey FOREIGN KEY (clinica_id) REFERENCES public.usuarios(usuario_id);


--
-- Name: autorizacoes autorizacoes_paciente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.autorizacoes
    ADD CONSTRAINT autorizacoes_paciente_id_fkey FOREIGN KEY (paciente_id) REFERENCES public.pacientes(paciente_id);


--
-- Name: autorizacoes autorizacoes_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.autorizacoes
    ADD CONSTRAINT autorizacoes_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(usuario_id);


--
-- Name: consultorios consultorios_clinica_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.consultorios
    ADD CONSTRAINT consultorios_clinica_id_fkey FOREIGN KEY (clinica_id) REFERENCES public.usuarios(usuario_id);


--
-- Name: disponibilidade_psicologos disponibilidade_psicologos_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.disponibilidade_psicologos
    ADD CONSTRAINT disponibilidade_psicologos_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(usuario_id);


--
-- Name: linked_psychologists linked_psychologists_clinica_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.linked_psychologists
    ADD CONSTRAINT linked_psychologists_clinica_id_fkey FOREIGN KEY (clinica_id) REFERENCES public.clinicas(id);


--
-- Name: linked_psychologists linked_psychologists_psychologist_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.linked_psychologists
    ADD CONSTRAINT linked_psychologists_psychologist_id_fkey FOREIGN KEY (psychologist_id) REFERENCES public.psicologos(id);


--
-- Name: notificacoes notificacoes_agendamento_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notificacoes
    ADD CONSTRAINT notificacoes_agendamento_id_fkey FOREIGN KEY (agendamento_id) REFERENCES public.agendamentos(agendamento_id);


--
-- Name: pacientes pacientes_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pacientes
    ADD CONSTRAINT pacientes_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(usuario_id);


--
-- Name: participantes_cursos participantes_cursos_curso_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.participantes_cursos
    ADD CONSTRAINT participantes_cursos_curso_id_fkey FOREIGN KEY (curso_id) REFERENCES public.cursos(id);


--
-- Name: participantes_cursos participantes_cursos_psicologo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.participantes_cursos
    ADD CONSTRAINT participantes_cursos_psicologo_id_fkey FOREIGN KEY (psicologo_id) REFERENCES public.psicologos(id);


--
-- Name: prontuarios prontuarios_paciente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prontuarios
    ADD CONSTRAINT prontuarios_paciente_id_fkey FOREIGN KEY (paciente_id) REFERENCES public.pacientes(paciente_id);


--
-- Name: prontuarios prontuarios_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prontuarios
    ADD CONSTRAINT prontuarios_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(usuario_id);


--
-- Name: psicologos psicologos_clinica_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.psicologos
    ADD CONSTRAINT psicologos_clinica_id_fkey FOREIGN KEY (clinica_id) REFERENCES public.clinicas(id);


--
-- Name: reset_password_tokens reset_password_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reset_password_tokens
    ADD CONSTRAINT reset_password_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.usuarios(usuario_id);


-- Added on 07/12/2023 by gabrielpaiv

CREATE TABLE attended_options (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL
);

INSERT INTO attended_options (id, title) VALUES 
(1, 'Sim'),
(2, 'Não, reagendado'),
(3, 'Não, mas cancelado antes de 24h'),
(4, 'Não comparecimento'),
(5, 'Desmarcado pelo psicoterapeuta'),
(6, 'Outro');

CREATE TABLE punctuality_options (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL
);

INSERT INTO punctuality_options (id, title) VALUES 
(1, 'No horário'),
(2, 'Antecipado'),
(3, 'Atrasado');

CREATE TABLE mood_states (
    id SERIAL PRIMARY KEY,
    value DECIMAL(2, 1) NOT NULL,
    title VARCHAR(255) NOT NULL
);

INSERT INTO mood_states (id, value, title) VALUES 
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

CREATE SEQUENCE public.evolutions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE public.evolutions (
    evolution_id integer NOT NULL DEFAULT nextval('public.evolutions_id_seq'::regclass),
    usuario_id integer NOT NULL,
    paciente_id integer NOT NULL,
    attendance_status INT REFERENCES attended_options(id),
    punctuality_status INT REFERENCES punctuality_options(id),
    arrival_mood_state INT REFERENCES mood_states(id),
    discussion_topic TEXT,
    analysis_intervention TEXT,
    next_session_plan TEXT,
    departure_mood_state INT REFERENCES mood_states(id),
    therapist_notes TEXT
);

ALTER SEQUENCE public.evolutions_id_seq OWNED BY public.evolutions.evolution_id;

ALTER TABLE ONLY public.evolutions
    ADD CONSTRAINT evolutions_pkey PRIMARY KEY (evolution_id);

ALTER TABLE ONLY public.evolutions
    ADD CONSTRAINT evolutions_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(usuario_id);

ALTER TABLE ONLY public.evolutions
    ADD CONSTRAINT evolutions_paciente_id_fkey FOREIGN KEY (paciente_id) REFERENCES public.pacientes(paciente_id);


-- Added on 08/12/2023 by gabrielpaiv

ALTER TABLE public.evolutions
ADD COLUMN session_date TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
ADD COLUMN evolution_status BOOLEAN DEFAULT false;

-- Added on 15/12/2023 by gabrielpaiv

CREATE SEQUENCE public.anamnesis_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE public.anamnesis (
    anamnesis_id integer NOT NULL DEFAULT nextval('public.anamnesis_id_seq'::regclass),
    usuario_id integer NOT NULL,
    paciente_id integer NOT NULL,
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
    diagnosis TEXT),
    healthy_life_habits TEXT,
    relevant_information TEXT
);

ALTER SEQUENCE public.anamnesis_id_seq OWNED BY public.anamnesis.anamnesis_id;

ALTER TABLE ONLY public.anamnesis
    ADD CONSTRAINT anamnesis_pkey PRIMARY KEY (anamnesis_id);

ALTER TABLE ONLY public.anamnesis
    ADD CONSTRAINT anamnesis_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(usuario_id);

ALTER TABLE ONLY public.anamnesis
    ADD CONSTRAINT anamnesis_paciente_id_fkey FOREIGN KEY (paciente_id) REFERENCES public.pacientes(paciente_id);

ALTER TABLE public.anamnesis
    ADD COLUMN created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now();

-- Added on 21/12/2023 by gabrielpaiv

CREATE SEQUENCE public.patient_closure_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE public.patient_closure (
    patient_closure_id integer NOT NULL DEFAULT nextval('public.patient_closure_id_seq'::regclass),
    usuario_id integer NOT NULL,
    paciente_id integer NOT NULL,
    case_status VARCHAR(100),
    overall_results_evaluation INTEGER,
    initial_expectations_met TEXT,
    treatment_duration_sessions INTEGER,
    healthy_life_habits_acquired TEXT,
    additional_relevant_information TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

ALTER SEQUENCE public.patient_closure_id_seq OWNED BY public.patient_closure.patient_closure_id;

ALTER TABLE ONLY public.patient_closure
    ADD CONSTRAINT patient_closure_pkey PRIMARY KEY (patient_closure_id);

ALTER TABLE ONLY public.patient_closure
    ADD CONSTRAINT patient_closure_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(usuario_id);

ALTER TABLE ONLY public.patient_closure
    ADD CONSTRAINT patient_closure_paciente_id_fkey FOREIGN KEY (paciente_id) REFERENCES public.pacientes(paciente_id);

-- Added on 23/01/2024 by gabrielpaiv

ALTER TABLE public.usuarios
    ADD COLUMN first_access UUID;

-- Added on 24/01/2024 by gabrielpaiv

ALTER TABLE public.usuarios
    ADD COLUMN email_auxiliar character varying(255);

--
-- PostgreSQL database dump complete
--