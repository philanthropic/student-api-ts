import { Connect } from "../common/connect";
import { StudentServices} from "../services/student";

export class StudentController{

    private async getStudentService(){
        const dbconn = await Connect();
        const StudentService = new StudentServices(dbconn);
        return StudentService;
    };
    
    async studentDetails(req: any, res: any){
        const studentId: number = req.params.studentId;

        if (!studentId){
            return res
                .status(400)
                .json({message: "Student Id not provided"});
        }

        const StudentService = await this.getStudentService();

        const studentObject = await StudentService.getStudentById(studentId);

        return res.status(200).json(studentObject);

    } 

    async addNewStudent(req: any, res:any){
        if (!req.body.first_name) {
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
            return res.status(400).json({ message: "grade name cannot be empty" });
        }
        if (!req.body.registration) {
            return res
                .status(400)
                .json({ message: "registration name cannot be empty" });
        }
        if (!req.body.subjects) {
            return res.status(400).json({ message: "subjects cannot be empty" });
        }
        if (!Array.isArray(req.body.subjects)) {
            return res.status(400).json({ message: "Invalid subjects" });
        }

        const StudentService = await this.getStudentService();

        const result = await StudentService.addNewStudent(req.body);
       
        res.status(200).json({ message: "Student data inserted!" });

    }

}