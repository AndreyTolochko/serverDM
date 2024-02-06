import jwt from 'jsonwebtoken';
const {verify} = jwt;


const verifyJWT = (req, res, next) => {
    
    const authHeader = req.headers.authorization || req.headers.Authorization

    if(!authHeader?.startsWith('Bearer ')){
        return res.status(401).json({message:'No bearer token provided'})
    }
    const token = authHeader.split(' ')[1]
    verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded)=>{
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    return res.status(401).json('Expired credentials')
                }
                return res.status(403).json('Invalid or missing credentials')
            }
            req.user = decoded.UserInfo.username;
            req.email = decoded.UserInfo.email;
            req.roles = decoded.UserInfo.roles;
            next();
        }
    )
}

export default verifyJWT;