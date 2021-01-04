-- SQL to create table for student api application.
--

-- Teachers table.
CREATE TABLE IF NOT EXISTS public.teachers
(
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL
);

-- Subjects table.
CREATE TABLE IF NOT EXISTS public.subjects
(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    teacher_id integer NOT NULL,
    grade integer NOT NULL,
    CONSTRAINT fk_subject_teacher_id FOREIGN KEY (teacher_id)
    REFERENCES public.teachers (id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
);

-- Students table
CREATE TABLE IF NOT EXISTS public.students
(
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    grade integer NOT NULL,
    registration VARCHAR(100) NOT NULL
);

-- Student Meta table
CREATE TABLE IF NOT EXISTS public.student_meta
(
    id SERIAL PRIMARY KEY,
    student_id integer NOT NULL,
    subject_id integer NOT NULL,
    CONSTRAINT fk_meta_student_id FOREIGN KEY (student_id)
    REFERENCES public.students (id)
    ON UPDATE NO ACTION
    ON DELETE CASCADE,
    CONSTRAINT fk_meta_subject_id FOREIGN KEY (subject_id)
    REFERENCES public.subjects (id)
    ON UPDATE NO ACTION
    ON DELETE CASCADE
);