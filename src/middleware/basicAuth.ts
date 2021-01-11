import { TeacherServices} from "../services/teacher"
import { Connect } from "../common/connect";


export class BasicAuth{
    async  authenticate (req, res, next) {
        // Bypass authentication if it is user registration endpoint
        // if (req.path === '/teachers/') {
        //     return next()
        // }
    
        // check for basic auth header
        if (
            !req.headers.authorization ||
            req.headers.authorization.indexOf('Basic ') === -1
        ) {
            return res.status(401).json({
                message: 'Missing Authorization Header'
            })
        }
        
        const dbconn = await Connect();
        var teacherService = new TeacherServices(dbconn);

        // verify auth credentials
        const base64Credentials = req.headers.authorization.split(' ')[1]
        const credentials = Buffer.from(base64Credentials, 'base64').toString(
            'ascii'
        )
        const [username, password] = credentials.split(':')
        const user: any = await teacherService.authenticate( username, password )
    
        if (user instanceof Error) {
            // log error message
            console.log(user.message);
            return res
                .status(401)
                .json({ message: 'Auth Error: Invalid Credentials' })
        }
    
        // attach systemUser object into expressJS request
        req.systemUserId = user.user_id
    
        next()
    }
    
}