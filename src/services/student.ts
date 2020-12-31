import {StudentModel} from "../models/student";

export class StudentServices{
    protected model: any;

    constructor(dbconnection: any){
        this.model = StudentModel.Student(dbconnection);
    }
    async getStudentById(studentId: number){
        var student = await this.model.findOne({
            where: { id: studentId},
        });
        return student;
    }
}