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
    
        //const count = animals.push('cows');

        for (let subObj of subject_ids) {
            let subject = await SubjectService.getSubjectById(subObj.subject_id);
            subjects.push(subject)
        }


        student = student.get({ plain: true });
        student.subjects = subjects;

        
        return student;
    }
}