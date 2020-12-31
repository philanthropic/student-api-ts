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
                .json({message: "Subect Id not provided"});
        }

        const SubjectService = await this.getSubjectService();

        const subjectObject = await SubjectService.getSubjectById(subjectId);

        return res.status(200).json(subjectObject);

    } 

}