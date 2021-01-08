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

--
-- Stored Procedures
--

-- Procedure with loop
--
-- CREATE OR REPLACE FUNCTION test(IN _id INT)
--     RETURNS SETOF text AS $$
-- DECLARE
--     _student_id text;
-- BEGIN
--     FOR _student_id IN
--       SELECT subject_id FROM student_meta WHERE student_id = _id;
--     LOOP
--         RETURN NEXT _student_id;
--           RAISE NOTICE 'hello'
--     END LOOP;
-- END;
-- $$ LANGUAGE plpgsql;

--
-- Procedure to return student table columens
CREATE OR REPLACE FUNCTION student_details_by_id(IN _id INT)
  RETURNS TABLE(
     id INT,
     fullname text,
     grade INT,
     registration character varying
  )
AS $$
#variable_conflict use_column
    BEGIN
        RETURN QUERY
            SELECT
               id,
               CONCAT(first_name, ' ', last_name) as fullname,
               grade,
               registration
            FROM students
            WHERE id = _id;
    END;
$$ LANGUAGE plpgsql;

--
-- procedure to return all subjects read by a student.
--
CREATE OR REPLACE FUNCTION subjects_by_student_id( IN _student_id INT )
  RETURNS TABLE(
     subject character varying,
     teacher text
  )
AS $$
#variable_conflict use_column
BEGIN
    RETURN QUERY
        SELECT subjects.name,
               CONCAT(teachers.first_name, ' ', teachers.last_name) as teacher
        FROM subjects
        JOIN teachers
            ON teachers.id = subjects.teacher_id
        JOIN student_meta
            ON student_meta.subject_id = subjects.id
        WHERE student_meta.student_id = _student_id;
END;
$$ LANGUAGE plpgsql;
