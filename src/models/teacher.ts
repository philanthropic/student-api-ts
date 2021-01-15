var Sequelize = require("sequelize");

const TeacherModel = {
    Teachers: function (context: any) {
        return context.define(
            "Teachers",
            {
                id: {
                    type: Sequelize.DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                },
                first_name: Sequelize.DataTypes.STRING,
                last_name: Sequelize.DataTypes.STRING,
                username: Sequelize.DataTypes.STRING,
                password:  Sequelize.DataTypes.STRING,
            },
            {
                tableName: "teachers",
                timestamps: false,
            }
        );
    },
};

export { TeacherModel };
