import { Connect } from "../common/connect";
import { StudentServices } from "../services/student";

export class StudentController {
    /**
     *  Get a new instance of StudentServices
     */
    private async getStudentService() {
        const dbconn = await Connect();
        const StudentService = new StudentServices(dbconn);
        return StudentService;
    }

    /**
     * Controller method to view student details.
     *
     * @param {any} req
     * @param {any} res
     */
    async studentDetails(req: any, res: any) {
        const studentId: number = req.params.studentId;

        if (!studentId) {
            return res.status(400).json({ message: "Student Id not provided" });
        }

        const StudentService = await this.getStudentService();
        const studentObject = await StudentService.getStudentById(studentId);
        
        if (studentObject instanceof Error){
            return res.status(400).json({message: studentObject.message})
        }

        return res.status(200).json(studentObject);
    }

    /**
     * Controller method to add new student.
     *
     * @param {any} req
     * @param {any} res
     */
    async addNewStudent(req: any, res: any) {
        if (!req.body.first_name ) {
            return res
                .status(400)
                .json({ message: "Student first name cannot be empty" });
        }

        if (!req.body.last_name) {
            return res
                .status(400)
                .json({ message: "student last name cannot be empty" });
        }

        if (!req.body.grade) {
            return res
                .status(400)
                .json({ message: "grade name cannot be empty" });
        }

        if (!req.body.registration) {
            return res
                .status(400)
                .json({ message: "registration name cannot be empty" });
        }

        if (!req.body.subjects) {
            return res
                .status(400)
                .json({ message: "subjects cannot be empty" });
        }

        if (!Array.isArray(req.body.subjects)) {
            return res.status(400).json({ message: "Invalid subjects" });
        }

        const StudentService: StudentServices = await this.getStudentService();
        const result: any = await StudentService.addNewStudent(req.body);

        if (result instanceof Error) {
            res.status(500).json({ message: result.message });
        }

        res.status(200).json({ message: "Student data inserted!" });
    }

    /**
     * Update student controller
     *
     * @param {any} req
     * @param {any} res
     */
    async updateStudent(req: any, res: any) {
        const studentId: number = req.params.studentId;
        const StudentService = await this.getStudentService();

        const isError = await StudentService.updateStudent(
            studentId,
            req.body
        );

        if (isError instanceof Error) {
            console.log(isError.message);
            res.status(500).json({ message: "Something went wrong" });
        }

        res.status(200).json({
            message: "Student details successfully updated.",
        });
    }

    async deleteStudent(req: any, res: any) {
        const studentId = req.params.studentId;
        if (!studentId) {
            return res.status(400).json({ message: "studentId not provided." });
        }

        // Create a new StudentService
        const StudentService = await this.getStudentService();
        const isError = await StudentService.deleteStudent(studentId);

        if (isError instanceof Error) {
            return res.status(500).json({ message: isError.message });
        }

        return res
            .status(200)
            .json({ message: "Student successfully deleted." });
    }

    /**
     *  List students Controller
     *   i. Pagination
     *   ii. Search student when querystring s is provided
     *     e.g ?s=hari will search "hari" into student db.
     *
     * @param {number} currentPageNumber
     * @param {string} searchString
     */
    async studentList(req: any, res: any) {
        const currentPage: number = req.params.pageId || 1;
        const searchString: string = req.query.search;

    
        // Create a new StudentService
        const StudentService = await this.getStudentService();

        const studentList = await StudentService.listStudents(
            currentPage,
            searchString
        );

        if (studentList instanceof Error) {
            console.log(studentList.message);
            res.status(500).json({ message: "something went wrong." });
            return;
        }

        res.status(200).json(studentList);
    }
}
