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

}