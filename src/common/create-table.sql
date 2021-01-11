-- SQL to create table for student api application.
--

-- Teachers table.
CREATE TABLE IF NOT EXISTS public.teachers
(
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    username VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL
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
    registration VARCHAR(100) NOT NULL,
    
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
-- CREATE OR REPLACE FUNCTION student_details_by_id(IN _id INT)
--   RETURNS TABLE(
--      id INT,
--      fullname text,
--      grade INT,
--      registration character varying
--   )
-- AS $$
-- #variable_conflict use_column
--     BEGIN
--         RETURN QUERY
--             SELECT
--                id,
--                CONCAT(first_name, ' ', last_name) as fullname,
--                grade,
--                registration
--             FROM students
--             WHERE id = _id;
--     END;
-- $$ LANGUAGE plpgsql;

-- --
-- -- procedure to return all subjects read by a student.
-- --
-- CREATE OR REPLACE FUNCTION subjects_by_student_id( IN _student_id INT )
--   RETURNS TABLE(
--      subject character varying,
--      teacher text
--   )
-- AS $$
-- #variable_conflict use_column
-- BEGIN
--     RETURN QUERY
--         SELECT subjects.name,
--                CONCAT(teachers.first_name, ' ', teachers.last_name) as teacher
--         FROM subjects
--         JOIN teachers
--             ON teachers.id = subjects.teacher_id
--         JOIN student_meta
--             ON student_meta.subject_id = subjects.id
--         WHERE student_meta.student_id = _student_id;
-- END;
-- $$ LANGUAGE plpgsql;

-- -- Procedure to return student table columens
-- CREATE OR REPLACE FUNCTION student_details_by_id(IN _id INT)
--   RETURNS TABLE(
--      id INT,
--      fullname text,
--      grade INT,
--      registration character varying,
--      subject character varying,
--      teacher text
--   )
-- AS $$
-- #variable_conflict use_column
--     BEGIN
--         RETURN QUERY
--             SELECT
--                students.id,
--                CONCAT(students.first_name, ' ', students.last_name) as fullname,
--                students.grade,
--                students.registration,
--                subjects.name,
--                CONCAT(teachers.first_name, ' ', teachers.last_name) as teacher
--             FROM
--                students
--                JOIN
--                   student_meta as meta
--                   ON meta.student_id = students.id
--                JOIN
--                   subjects
--                   ON subjects.id = meta.subject_id
--                JOIN
--                   teachers
--                   ON teachers.id = subjects.teacher_id
--             WHERE
--                students.id = _id;
--     END;
-- $$ LANGUAGE plpgsql;

--detail
-- FUNCTION: public.student_details_by_id(integer)

-- DROP FUNCTION public.student_details_by_id(integer);

CREATE OR REPLACE FUNCTION public.student_details_by_id(
	_id integer)
    RETURNS TABLE(id integer, fullname text, grade integer, registration character varying, subject character varying, teacher text) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
#variable_conflict use_column
    BEGIN
        RETURN QUERY
            SELECT
               students.id,
               CONCAT(students.first_name, ' ', students.last_name) as fullname,
               students.grade,
               students.registration,
               subjects.name,
               CONCAT(teachers.first_name, ' ', teachers.last_name) as teacher
            FROM
               students
               JOIN
                  student_meta as meta
                  ON meta.student_id = students.id
               JOIN
                  subjects
                  ON subjects.id = meta.subject_id
               JOIN
                  teachers
                  ON teachers.id = subjects.teacher_id
            WHERE
               students.id = _id;
    END;
$BODY$;

ALTER FUNCTION public.student_details_by_id(integer)
    OWNER TO postgres;



--list
CREATE OR REPLACE FUNCTION list_students(IN _itemsperpage INT, IN _offset INT)
  RETURNS TABLE(
     id INT,
     fullname text,
     grade INT,
     registration character varying,
     subject character varying,
     teacher text
  )
AS $$
#variable_conflict use_column
    BEGIN
        RETURN QUERY
            SELECT
               students.id,
               CONCAT(students.first_name, ' ', students.last_name) as fullname,
               students.grade,
               students.registration,
               subjects.name,
               CONCAT(teachers.first_name, ' ', teachers.last_name) as teacher
            FROM
               students
               JOIN
                  student_meta as meta
                  ON meta.student_id = students.id
               JOIN
                  subjects
                  ON subjects.id = meta.subject_id
               JOIN
                  teachers
                  ON teachers.id = subjects.teacher_id
            ORDER BY id DESC LIMIT _itemsperpage OFFSET _offset;
               
    END;
$$ LANGUAGE plpgsql;

--update students
C
CREATE OR REPLACE FUNCTION update_students(
   _id INT,
   _first_name  character varying,
   _last_name  character varying,
   _grade INT,
   _registration  character varying
) RETURNS BOOLEAN 
 AS $$
BEGIN
    UPDATE public.students
       SET first_name =  _first_name,
               last_name      = _last_name,
               grade  = _grade,
               registration  = _registration
       WHERE  id = _id;
  RETURN 1;
END;
$$ LANGUAGE plpgsql;

--SELECT * from update_students(8, 'Aakar', 'KC',9, 'BBXX');

--create student1
CREATE OR REPLACE function create_studentx(
    _first_name character varying,
    _last_name text,
    _grade INT,
    _registration text
) RETURNS INT
AS $$
DECLARE
    _student_id INT;
BEGIN

      INSERT INTO students
        (first_name, last_name, grade, registration)
        VALUES (_first_name, _last_name, _grade, _registration)
        RETURNING id INTO _student_id;
   RETURN _student_id;

END;
$$ LANGUAGE plpgsql;

select * FROM create_studentx('hari', 'lamsal', 10, 'XBC');


--login/validation for teachers
CREATE EXTENSION citext;
CREATE DOMAIN email AS citext
  CHECK ( value ~ '^[a-zA-Z0-9.!#$%&''*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$' );

--SELECT 'foobar@bar.com'::email;
--SELECT CAST('foobar@bar.com' AS email);


