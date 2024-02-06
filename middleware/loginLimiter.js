import {rateLimit} from 'express-rate-limit';



const loginLimiter = rateLimit({
    windowMs:120*1000, // 2 minute
    max:5,
    message:{message:'Too many login attempts from this IP, please try again after 1 minute pause.'},
    handler:(req,res, next, options) =>{
        res.status(options.statusCode).send(options.message)
    },
    standardHeaders:true, // Return rate limit info in the `RateLimit-`* headers
    legacyHeaders:false, // Disable `X-RateLimit-*` headers
})

export default loginLimiter;