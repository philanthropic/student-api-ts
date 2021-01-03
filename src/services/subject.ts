import {SubjectModel} from "../models/subject";
import { TeacherServices } from "../services/teacher";

export class SubjectServices{
    protected model: any;
    protected dbConn: any;

    constructor(dbconnection: any){
        this.model = SubjectModel.Subject(dbconnection);
        this.dbConn = dbconnection;
    }

    async getSubjectById(subjectId: number){
        var subject = await this.model.findOne({
            where: { id: subjectId},
        });

        var TeacherServiceInstance = new TeacherServices(this.dbConn);
        var teacherObj = await TeacherServiceInstance.getTeacherById(subject.teacher_id);

        subject = subject.get({ plain: true });
        subject.teacher = teacherObj.get({ plain: true });

        delete subject.teacher_id;
        //console.log("check", subject.get({ plain: true }));
    
        
        return subject;
        
    }

    async getSubjectIdByName(subjectName: string){
        var subject = await this.model.findOne({
            where: { name: subjectName},
            defaults: { id: 0 }
        });
        
        if (subject === null){
            return 0; 
        }

        return subject.id;
    }
}

