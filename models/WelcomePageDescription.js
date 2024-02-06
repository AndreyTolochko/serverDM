import mongoose from 'mongoose'



const welcomePageDescriptionSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    text:{
        type:String,
        required:true
    }
})

const welcomePageDescription = mongoose.model('WelcomePageDescription', welcomePageDescriptionSchema)

export default welcomePageDescription;