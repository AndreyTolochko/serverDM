import mongoose from 'mongoose';
import * as argon2 from 'argon2';

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required:true,

    },
    email:{
        type:String,
        required: true,
    },    
    password:{
        type: String,
        required:true,
    },
    roles:[{
        type:String,
        enum:["admin","paidUser","user"],
        default:"user"
    }]

},{timestamps:true})

userSchema.statics.signup = async function(username, email, password){
    
    const emailExist = await this.findOne({email});
    const usernameExist = await this.findOne({username});
    if(emailExist && usernameExist){
        throw Error('Пользователь с таким именем и почтой уже существует');
    }else if(emailExist){
        throw Error('Пользователь с такой почтой уже существует')
    }else if(usernameExist){
        throw Error('Пользователь с таким именем уже существует')
    }

    const hash = await argon2.hash(password);

    const user = await this.create({username, email, password:hash, roles:["user"]})
    return user
}

const User = mongoose.model('User', userSchema);
export default User;