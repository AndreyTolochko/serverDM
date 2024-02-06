import allowedOrigins from "./allowedOrigins.js";


const corsOptions = {
    origin: function(origin, callback) {
        if(allowedOrigins.indexOf(origin) !==-1 || !origin){
            callback(null, true);
        }else{
            new Error('Not allowed by CORS')
        }
    },
    credentials:true,
    optionsSuccessStatus: 200
}

export default corsOptions;