import { Connect } from "../common/connect";

async function checkCredentials(
    username: string,
    password: string,
    tablename: string
)  {
    const sequelize = await Connect();
    let row = await sequelize.query(
        "SELECT * FROM " + tablename + " WHERE username= :username  LIMIT 1",
       
        {
            replacements: { username: username },
            type: sequelize.QueryTypes.SELECT,
        }
    );


    if (row instanceof Error) {
        return new Error(row.message);
    }

    // if 'storedPassword' is returned null, then username doesnt exist.
    if (!row[0]) {
        return new Error("Invalid username");
    }

    if (password !== row[0].password) {
        return new Error("Invalid password!");
    }

    return row[0].id;
}

export class BasicAuth {
    async authenticate(req: any, res: any, next: any) {
        // check for basic auth header
        if (
            !req.headers.authorization ||
            req.headers.authorization.indexOf("Basic ") === -1
        ) {
            return res.status(401).json({
                message: "Missing Authorization Header",
            });
        }

        // verify auth credentials
        const base64Credentials = req.headers.authorization.split(" ")[1];
        const credentials = Buffer.from(base64Credentials, "base64").toString(
            "ascii"
        );
        const [username, password] = credentials.split(":");

        let teacherId: any = await checkCredentials(
            username,
            password,
            "teachers"
        );

        if (teacherId instanceof Error) {
            // Checking if credentiasl are of student.
            const studentId: any = await checkCredentials(
                username,
                password,
                "students"
            );

            if (studentId instanceof Error) {
                return res
                    .status(401)
                    .json({ message: "Auth Error: Invalid Credentials/Not registered user" });
            }

            // student authenticated
            req.authUser = {
                type: "student",
                id: studentId,
            };
            next();
            return;
        }

        // teacher valid
        req.authUser = {
            type: "teacher",
            id: teacherId,
        };
        next();
    }
}
