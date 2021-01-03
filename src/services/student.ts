import {StudentModel} from "../models/student";
import { SubjectServices} from "./subject";

export class StudentServices{
    protected model: any;
    protected context: any;

    constructor(dbconnection: any){
        this.context= dbconnection;
        this.model = StudentModel.Student(dbconnection);
    }

    async getStudentById(studentId: number){
        var student = await this.model.findOne({
            where: { id: studentId},
        });
        
        var subject_ids = await this.context.query(
             "SELECT subject_id FROM student_meta WHERE student_id = ?",
            { replacements: [studentId], type: this.context.QueryTypes.SELECT }
        )

        const SubjectService = new SubjectServices(this.context);
        
        let subjects: {id: number, name: string, grade: number, teacher: any}[]= [];
    
        for (let subObj of subject_ids) {
            let subject = await SubjectService.getSubjectById(subObj.subject_id);
            subjects.push(subject)
        }


        student = student.get({ plain: true });
        student.subjects = subjects;

        
        return student;
    }
    /* 
    steps:
    1. payload should look like 
        {
        "first_name": "StudentA",
        "last_name": "KC",
        "grade": "10",
         "registration": "xyz",
         "subjects": [ "Maths", "Science", "English", "Nepali"]
        } 
    2. item from payload fuction i.e first_name, last_name..... 
        should be inserted into student table.
    3. Each items in "subjects" is verified, if they exists in 
        subject table
    4. subject_id from respective items of "subjects" of payload 
        is retrived and stored into student_meta table along with the newly
        created student_id(achieved from step 2).
    */

    async addNewStudent(studentObj: any){
        var student = await this.model.create({
            first_name: studentObj.first_name,
            last_name: studentObj.last_name,
            grade: studentObj.grade,
            registration: studentObj.registration
        });

        //creating new subject services instances
        const SubjectService = new SubjectServices(this.context);
        //looping through subject array
        for (let subject of studentObj.subjects) {
            if (typeof subject !== "string") {
                continue;
            }
            let subjectId = await SubjectService.getSubjectIdByName(subject);
            if (subjectId === 0) {
                continue;
            }

           let result= await this.context.query(
               `INSERT INTO student_meta 
                    (student_id, subject_id) 
               VALUES
                    (:student_id, :subject_id)
                `,
                {
                    replacements: { 
                        student_id: student.id,
                        subject_id: subjectId,                    
                    }, 
                    type: this.context.QueryTypes.INSERT
                }
           );
        }
    }
}