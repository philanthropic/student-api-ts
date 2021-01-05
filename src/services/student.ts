import { StudentModel } from "../models/student";
import { SubjectServices } from "./subject";

export class StudentServices {
    protected model: any;
    protected context: any;

    constructor(dbconnection: any) {
        this.context = dbconnection;
        this.model = StudentModel.Student(dbconnection);
    }

    /**
     * Get Student By Id.
     *
     * @param {number} studentId
     */
    async getStudentById(studentId: number) {
        var student = await this.model.findOne({
            where: { id: studentId },
        });

        // fetch all subject_ids associated with student_id from student_meta
        var subject_ids = await this.context.query(
            "SELECT subject_id FROM student_meta WHERE student_id = ?",
            { replacements: [studentId], type: this.context.QueryTypes.SELECT }
        );

        const SubjectService = new SubjectServices(this.context);

        let subjectsData: {
            Subject: string;
            Teacher: string;
        }[] = [];

        for (let subObj of subject_ids) {
            let subject = await SubjectService.getSubjectById(
                subObj.subject_id
            );
            subjectsData.push(
                {
                    Subject: subject.name, 
                    Teacher: subject.teacher
                }
            );
        }

        student = student.get({ plain: true });
        student.FullName = student.first_name + " " + student.last_name
        
        delete student.first_name;
        delete student.last_name;
        delete student.id;

        student.subjects = subjectsData;

        return student;
    }

    /**
     *
     *  steps:
     *  1. payload should look like
     *      {
     *          "first_name": "StudentA",
     *          "last_name": "KC",
     *          "grade": "10",
     *          "registration": "xyz",
     *          "subjects": [ "Maths", "Science", "English", "Nepali"]
     *      }
     *  2. item from payload fuction i.e first_name, last_name.....
     *      should be inserted into student table.
     *  3. Each items in "subjects" is verified, if they exists in
     *      subject table
     *  4. subject_id from respective items of "subjects" of payload
     *      is retrived and stored into student_meta table along with the newly
     *      created student_id(achieved from step 2).
     */
    async addNewStudent(studentObj: any) {
        var student = await this.model.create({
            first_name: studentObj.first_name,
            last_name: studentObj.last_name,
            grade: studentObj.grade,
            registration: studentObj.registration,
        });

        // creating new subject services instances
        const SubjectService = new SubjectServices(this.context);

        // looping through subject array
        for (let subject of studentObj.subjects) {
            if (typeof subject !== "string") {
                continue;
            }

            let subjectId = await SubjectService.getSubjectIdByName(subject);
            if (subjectId === 0) {
                continue;
            }

            const result = this.addSubjectMeta(student.id, subjectId);
            if (result instanceof Error) {
                return result;
            }
        } // subjects loop end
    }

    /**
     * Update student details.
     *
     * @param {number} studentId
     * @param {any} studentObject
     */
    async updateStudent(studentId: number, studentObject: any) {
        let result = this.model
            .update(studentObject, {
                where: { id: studentId },
            })
            .then((success: any) => {
                return success;
            })
            .catch((error: Error) => {
                return error;
            });

        // new instance subject service
        const SubjectService = new SubjectServices(this.context);
        
        result = await this.deleteStudentMeta(studentId);
        if (result instanceof Error) {
            return result;
        }
        // Now check if valid subjects are passed in studentObject
        // looping through subject array
        for (let subject of studentObject.subjects) {
            if (typeof subject !== "string") {
                continue;
            }

            // Check if passed subject in the subjects table.
            let subjectId = await SubjectService.getSubjectIdByName(subject);

            // if passed subject is not in subjects table skip it
            if (subjectId === 0) {
                continue;
            }

            let result = await this.addSubjectMeta(studentId, subjectId);
            if (result instanceof Error) {
                return result;
            }
        }

        return result;
    }

    /**
     * Add subject_meta
     *
     * @param {number} studentId
     * @param {number} subjectId
     */
    async addSubjectMeta(studentId: number, subjectId: number) {
        const sql = `
            INSERT INTO student_meta
                (student_id, subject_id)
            VALUES
            (:student_id, :subject_id)`;

        let result = await this.context
            .query(sql, {
                replacements: {
                    student_id: studentId,
                    subject_id: subjectId,
                },
                type: this.context.QueryTypes.INSERT,
            })
            .then((success: any) => {
                return success;
            })
            .catch((error: Error) => {
                return error;
            });

        return result;
    }

    /**
     * Delete all student meta records
     *
     * @param {number} studentId
     */
    async deleteStudentMeta(studentId: number) {
        const sql = `DELETE FROM student_meta WHERE student_id = ?`;

        let result = await this.context
            .query(sql, {
                replacements: [studentId],
                type: this.context.QueryTypes.INSERT,
            })
            .then((success: any) => {
                return success;
            })
            .catch((error: Error) => {
                return error;
            });

        return result;
    }

    /**
     *  List students
     *   i. Pagination
     *   ii. Search student when querystring s is provided
     *     e.g ?s=hari will search "hari" into student db.
     *
     * @param {number} currentPageNumber
     * @param {string} searchString
     */
    async listStudents(currentPageNumber: number, searchString: string) {
        const itemsPerPage: number = 2;
        const offset: number = (currentPageNumber - 1) * itemsPerPage;
        let result: any;
        if (searchString) {
            result = await this.context.query(
                `SELECT * FROM students
                WHERE first_name LIKE :searchString
                OR last_name LIKE :searchString
                OR registration LIKE :searchString
                ORDER BY id  DESC LIMIT :itemsPerPage OFFSET :offset
                `,
                {
                    replacements: {
                        searchString: "%" + searchString + "%",
                        itemsPerPage: itemsPerPage,
                        offset: offset,
                    },
                    type: this.context.QueryTypes.SELECT,
                }
            );
        } else {
            result = this.context
                .query(
                    "SELECT * FROM students ORDER BY id DESC LIMIT :itemsPerPage OFFSET :offset",
                    {
                        replacements: {
                            itemsPerPage: itemsPerPage,
                            offset: offset,
                        },
                        type: this.context.QueryTypes.SELECT,
                    }
                )
                .then((result: any) => {
                    return result;
                })
                .catch((error: Error) => {
                    return error;
                });
        }
        return result;
    }

    /**
     * Delete student from db.
     *
     * @param {number} studentId
     */
    async deleteStudent(studentId: number) {
        const rowDelete = this.model.destroy({ where: { id: studentId } });
        if (rowDelete === 1) {
            return true;
        }
        return rowDelete;
    }
}

/* 
{
"Full Name" : "Bijay Shrestha",
	"Registration" : "",
	"Grade" : "",
	"Subjects" : [
		{ 
			"Subject" : "Math",
			"Teacher" : "Ram Thakur"
		},
		{ 
			"Subject" : "Science",
			"Teacher" : "Hari KC"
		},
		{ 
			"Subject" : "English",
			"Teacher" : "Sita Sth"
		}
	]
} */