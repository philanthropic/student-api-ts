import { TeacherModel } from "../models/teacher";

export class TeacherServices {
    protected model: any;

    constructor(dbconnection: any) {
        this.model = TeacherModel.Teachers(dbconnection);
    }

    async getTeacherById(teacherId: number) {
        var teacher = await this.model.findOne({
            where: { id: teacherId },
        });
        return teacher;
    }
}
