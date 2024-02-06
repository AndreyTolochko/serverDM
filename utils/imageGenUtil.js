import fs, { realpathSync } from 'fs';
import { createCanvas, loadImage } from 'canvas';
import { createWriteStream,  } from 'fs';
import { join } from 'path';
import {v4 as uuidv4} from 'uuid';
import {format} from 'date-fns';



const generateImage = async (calculator) => {
  try{
      const templatePath = join(process.cwd(), 'public','template_matrix.png');
      const image = await loadImage(templatePath);
      let resImage=null;
      const canvas = createCanvas(image.width, image.height);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(image, 0, 0);

      const props = Object.keys(calculator);
      for (const property of props) {
        if (calculator[property].hasOwnProperty('position')) {
          ctx.font = `${calculator[property].fontSize}px sans-serif`;
          ctx.fillStyle = 'black';
          ctx.textBaseline = 'middle';
          ctx.textAlign = 'center';
          ctx.fillText(
            calculator[property].result.toString(),
            calculator[property].position[0],
            calculator[property].position[1]
          );
          }
        }
        
      return canvas.toDataURL()        
  }catch(error){
    console.log({message:`${error}`})
  }
 
  }




export default generateImage;