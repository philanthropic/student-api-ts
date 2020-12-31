import { Connect } from "../common/connect";
import { TeacherServices } from "../services/teacher";

export class TeacherController {

    private async getTeacherService (){
        const dbconn = await Connect();
        const TeacherService = new TeacherServices(dbconn);
        return TeacherService;
    };

    async teacherDetails(req: any, res: any) {
        const teacherId: number = req.params.teacherId;

        if (!teacherId) {
            return res
                .status(400)
                .json({ message: "Teacher Id not provided." });
        }

        const TeacherService = await this.getTeacherService();

        const teacherObject = await TeacherService.getTeacherById(teacherId);

        return res.status(200).json(teacherObject);
    }
}
