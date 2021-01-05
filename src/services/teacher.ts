import { TeacherModel } from "../models/teacher";

export class TeacherServices {
     // Teacher Model sequelize object
     protected model: any;

     // Current sequelize context with db connection.
     protected context: any;
 
     constructor(dbconnection: any) {
         this.model = TeacherModel.Teachers(dbconnection);
         this.context = dbconnection;
     }
 
     async getTeacherById(teacherId: number) {
         var teacher = await this.model.findOne({ where: { id: teacherId } });
         return teacher;
     }
 
     /**
      * Add new teacher into db.
      *
      * @param {any} payload
      */
     async addNewTeacher(teacherPayload: any) {
         const result = this.model.create(teacherPayload);
         return result;
     }
 
     /**
      * Update teacher details.
      *
      * @param {number} teacherId
      * @param {any} payload
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


        const teacherObject = await this.getTeacherById(teacherId);

        if (teacherObject instanceof Error) {
            res.status(500).json({ message: teacherObject.message });
        }

        return res.status(200).json(teacherObject);
    }

     async updateTeacher(teacherId: number, payload: any) {
         // https://sequelize.org/v4/manual/tutorial/querying.html
         const updatedTeacher = await this.model.update(
             {
                 first_name: payload.first_name,
                 last_name: payload.last_name,
             },
             { where: { id: teacherId } }
         );
         return updatedTeacher;
     }
 
     /**
      * Delete teacher from db.
      *
      * @param {number} teacherId
      */
     async deleteTeacher(teacherId: number) {
         const rowDelete = this.model.destroy({ where: { id: teacherId } });
         if (rowDelete === 1) {
             return true;
         }
         return rowDelete;
     }
}
