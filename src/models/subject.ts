var Sequelize = require("sequelize");
var moment = require( "moment");

const SubjectModel = {
    Subject: function(context: any){

        let modelSubject = context.define(
            "Subjects",
            {
                id: {
                    type: Sequelize.DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                },
                name: {type: Sequelize.DataTypes.STRING,
                },
                teacher_id: {type: Sequelize.DataTypes.STRING,
                },
                grade:  {type: Sequelize.DataTypes.STRING,
                },
            },
            {
                tableName: "subjects",
                timestamps: false,
            }  
        );
        return modelSubject;
    },
}

export {SubjectModel};