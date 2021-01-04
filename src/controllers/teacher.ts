import { Connect } from "../common/connect";
import { TeacherServices } from "../services/teacher";

export class TeacherController {
    /**
     * Creates a new Instance of TeacherSerivces.
     *
     * @return TeacherServices an Instance of TeacherServices
     */
    private async getTeacherService (){
        const dbconn = await Connect();
        const TeacherService = new TeacherServices(dbconn);
        return TeacherService;
    };

    /**
     * Displays teacher details.
     *
     * @param {any} req ExpressJS req object
     * @param {any} res ExpressJS res object
     */
    async teacherDetails(req: any, res: any) {
        // teacherId is in the request url. eg. http://localhost:800/teachers/view/1
        // here 1 at the end of the url is "teacherId" which is defined in routes.
        const teacherId: number = req.params.teacherId;

        if (!teacherId) {
            return res
                .status(400)
                .json({ message: "Teacher Id not provided." });
        }

        // create a new TeacherServices instance
        const TeacherService = await this.getTeacherService();

        const teacherObject = await TeacherService.getTeacherById(teacherId);

        if (teacherObject instanceof Error) {
            res.status(500).json({ message: teacherObject.message });
        }

        return res.status(200).json(teacherObject);
    }

    /**
     * Add new teacher controller
     *
     * @param {any} req
     * @param {any} res
     */
    async addNewTeacher(req: any, res: any) {
        if (!req.body.first_name) {
            res.status(400).json({
                message: "teacher first name cannot be empty",
            });
        }

        if (!req.body.last_name) {
            res.status(400).json({
                message: "teacher last name cannot be empty",
            });
        }

        // create a new TeacherServices instance
        const TeacherService = await this.getTeacherService();
        const addTeacher = await TeacherService.addNewTeacher(req.body);
        if (addTeacher instanceof Error) {
            res.status(500).json({ message: addTeacher.message });
        }

        res.status(201).json({ message: "Teacher data inserted!" });
    }

    /**
     * Update teacher controller.
     *
     * @param {any} req
     * @param {any} res
     */
    async updateTeacher(req: any, res: any) {
        const teacherId: number = req.params.teacherId;

        if (!teacherId) {
            return res
                .status(400)
                .json({ message: "Teacher Id not provided." });
        }

        // Create a new TeacherService
        const TeacherService = await this.getTeacherService();
        // the payload sent by the user will be in the "req.body"
        const isError = await TeacherService.updateTeacher(teacherId, req.body);

        if (isError instanceof Error) {
            return res.status(500).json({ message: isError.message });
        }

        res.status(201).json({ message: "Teacher data inserted!" });
    }

    async deleteTeacher(req: any, res: any) {
        const teacherId = req.params.teacherId;
        if (!teacherId) {
            return res.status(400).json({ message: "teacherId not provided." });
        }

        // Create a new TeacherService
        const TeacherService = await this.getTeacherService();
        const isError = await TeacherService.deleteTeacher(teacherId);
        if (isError instanceof Error) {
            return res.status(500).json({ message: isError.message });
        }

        return res
            .status(200)
            .json({ message: "Teacher successfully deleted." });
    }
}
