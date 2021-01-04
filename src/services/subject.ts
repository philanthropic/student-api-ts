import { SubjectModel } from "../models/subject";
import { TeacherServices } from "../services/teacher";

export class SubjectServices {
    protected model: any;
    protected context: any;

    constructor(dbconnection: any) {
        this.model = SubjectModel.Subject(dbconnection);
        this.context = dbconnection;
    }

    async getSubjectById(subjectId: number) {
        var subject = await this.model.findOne({
            where: { id: subjectId },
        });

        var TeacherServiceInstance = new TeacherServices(this.context);
        var teacherObj = await TeacherServiceInstance.getTeacherById(subject.teacher_id);

        subject = subject.get({ plain: true });
        subject.teacher = teacherObj.get({ plain: true });

        // delte "teacher_id" item from subject
        // as there is new "teacher" object with teacher name and last name.
        delete subject.teacher_id;

        return subject;
    }

    async getSubjectIdByName(subjectName: string) {
        var subject = await this.model.findOne({
            where: { name: subjectName },
            defaults: { id: 0 },
        });

        if (subject === null) {
            return 0;
        }

        return subject.id;
    }

    /**
     * Add new subject into db.
     *
     * @param {any} payload
     */
    async addNewSubject(subjectPayload: any) {
        // We need to check the passed "teacher_id"
        // if that teacher exists in teachers table or not.

        // Create teacher service to check valid teacher id.
        var TeacherServiceInstance = new TeacherServices(this.context);
        var teacher = await TeacherServiceInstance.getTeacherById(
            subjectPayload.teacher_id
        );

        if (!teacher) {
            return new Error("invalid teacher id");
        }

        const result = this.model.create(subjectPayload);
        return result;
    }
}
