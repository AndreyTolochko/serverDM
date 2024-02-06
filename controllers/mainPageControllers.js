import Arcans from "../models/Arcans.js";
import Category from "../models/Category.js";
import Calculator from "../utils/calcMatrix.js";
import UserMatrix from "../utils/userMatrix.js";
import welcomePageDescription from "../models/WelcomePageDescription.js";
import generateImage from "../utils/imageGenUtil.js";
import path from 'path';
import fs from 'fs';


const getUrl = (imgPath)=>{
    if(!imgPath){
      return '';
    }
    const fileName=path.basename(imgPath);
    return `${process.env.DOMAIN}:${process.env.PORT}/public/images/${fileName}`    
  }


const getMatrix = async (req, res)=>{
    const arcans = await Arcans.find({});
    const categories = await Category.find({});
    //receive input of dob from user
    const {day, month, year} = req.body;
    //create object of calc class
    const calc = new Calculator(day, month, year);
    //genetate image and receive path
    const image = await generateImage(calc);
    
    //const url = getUrl(imagePath);
    const userMatrix = new UserMatrix(calc,arcans,categories);    
    const matrixData = await userMatrix.getMatrix();
    try{
        const data = {matrix:matrixData, img:image};
        if(matrixData){
            return res.status(200).send(data);
        }
    }catch(err){
        if(err.response?.data){
            return res.status(err.status).send(data);
        }
    }
}

const getContent = async (req, res) => {
    
    const descrSection = await welcomePageDescription.findOne({})
    if(!descrSection){
        return res.status(401).json({message:"No records found"})
    }
    res.status(200).json(descrSection);
}

export { getMatrix, getContent};