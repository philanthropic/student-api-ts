
 -- Table: public.subjects

-- DROP TABLE public.subjects;

CREATE TABLE public.subjects
(
    id integer NOT NULL,
    name character varying COLLATE pg_catalog."default" NOT NULL,
    teacher_id integer NOT NULL,
    grade integer NOT NULL,
    CONSTRAINT subjects_pkey PRIMARY KEY (id),
    CONSTRAINT fk_subject_teacher_id FOREIGN KEY (teacher_id)
        REFERENCES public.teachers (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.subjects
    OWNER to postgres;
         


-- Create grade table.
 
CREATE TABLE public.student_meta
(
    id SERIAL PRIMARY KEY,
    student_id integer NOT NULL,
    subject_id integer NOT NULL,
    CONSTRAINT fk_meta_student_id FOREIGN KEY (student_id)
        REFERENCES public.students (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT fk_meta_subject_id FOREIGN KEY (subject_id)
        REFERENCES public.subjects (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

-- Table: public.students

-- DROP TABLE public.students;

CREATE TABLE public.students
(
    id integer NOT NULL DEFAULT nextval('student_student_id_seq'::regclass),
    first_name character varying(100) COLLATE pg_catalog."default",
    last_name character varying(100) COLLATE pg_catalog."default",
    grade integer NOT NULL,
    registration character varying(100) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT student_pkey PRIMARY KEY (id),
    CONSTRAINT student_id UNIQUE (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.students
    OWNER to postgres;

-- Table: public.teachers

-- DROP TABLE public.teachers;

CREATE TABLE public.teachers
(
    id integer NOT NULL DEFAULT nextval('teacher_teacher_id_seq'::regclass),
    first_name character varying(100) COLLATE pg_catalog."default",
    last_name character varying(100) COLLATE pg_catalog."default",
    CONSTRAINT teacher_pkey PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.teachers
    OWNER to postgres;

-- Table: public.student_meta

-- DROP TABLE public.student_meta;

CREATE TABLE public.student_meta
(
    id integer NOT NULL,
    student_id integer NOT NULL,
    subject_id integer NOT NULL,
    CONSTRAINT student_meta_pkey PRIMARY KEY (id),
    CONSTRAINT fk_meta_student_id FOREIGN KEY (student_id)
        REFERENCES public.students (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT fk_meta_subject_id FOREIGN KEY (subject_id)
        REFERENCES public.subjects (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.student_meta
    OWNER to postgres;