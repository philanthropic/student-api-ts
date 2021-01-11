var Sequelize = require("sequelize");
var moment = require( "moment");

const StudentModel = {
    Student: function(context: any){
        //let context = Connect();

        let modelStudent = context.define(
            "Students",
            {
                id: {
                    type: Sequelize.DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                },
                first_name: {type: Sequelize.DataTypes.STRING,
                },
                last_name: {type: Sequelize.DataTypes.STRING,
                },
                grade:  {type: Sequelize.DataTypes.STRING,
                },
                registration: {type: Sequelize.DataTypes.STRING,
                },
                username:  {type: Sequelize.DataTypes.STRING,
                },
                password: {type: Sequelize.DataTypes.STRING,
                },
            },
            {
                //freezeTableName: true,
                tableName: "students",
                timestamps: false,
            }  
        );
        return modelStudent;
    },
}

export {StudentModel};