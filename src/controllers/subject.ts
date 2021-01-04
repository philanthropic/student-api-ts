import { Connect } from "../common/connect";
import { SubjectServices} from "../services/subject";

export class SubjectController{

    private async getSubjectService(){
        const dbconn = await Connect();
        const SubjectService = new SubjectServices(dbconn);
        return SubjectService;
    };
    
    async subjectDetails(req: any, res: any){
        const subjectId: number = req.params.subjectId;

        if (!subjectId){
            return res
                .status(400)
                .json({message: "Subject Id not provided"});
        }

        // Create new subject service
        const SubjectService = await this.getSubjectService();

        const subjectObject = await SubjectService.getSubjectById(subjectId);

        return res.status(200).json(subjectObject);   
    } 

    async addNewSubject(req: any, res: any) {
      
        if (!req.body.name) {
            res.status(400).json({ message: "name cannot be empty" });
        }

        if (!req.body.teacher_id) {
            res.status(400).json({
                message: "teacher_id name cannot be empty",
            });
        }

        if (!req.body.grade) {
            res.status(400).json({ message: "grade name cannot be empty" });
        }

        // Create new subject service
        const SubjectService = await this.getSubjectService();
        const addSubject = await SubjectService.addNewSubject(req.body);

        if (addSubject instanceof Error) {
            res.status(500).json({ message: addSubject.message });
        }

        res.status(200).json({ message: "Subject data inserted!" });
    }
}