import Calculator from '../utils/calcMatrix.js';
import UserMatrix from '../utils/userMatrix.js';
import generateImage from '../utils/imageGenUtil.js';
import { createReadStream, unlink } from 'fs';
import { Markup } from 'telegraf';



//const categories = await Category.find({});
//const arcans = await Arcans.find({});

function replaceUnsupportedHtmlTags(text) {
  // Replace <h4> and <h5> tags with <b> for bold text
  text = text.replace(/<\/?h[45]( class="[^"]*")?>/g, "<b>");

  // Remove any other unsupported HTML tags (or add more replacements as needed)
  text = text.replace(/<\/?[^>]+(>|$)/g, "");

  return text;
}
async function splitAndSendMessage(ctx, message) {
  const MAX_LENGTH = 4096;
  for (let i = 0; i < message.length; i += MAX_LENGTH) {
      const messagePart = message.substring(i, Math.min(i + MAX_LENGTH, message.length));
      await ctx.reply(replaceUnsupportedHtmlTags(messagePart), { parse_mode: 'HTML' });
  }
}

async function sendHtmlMessage(ctx,userMatrix) {
  for(const key in userMatrix){
    if(userMatrix.hasOwnProperty(key) & userMatrix[key].hasOwnProperty('initial')){
      const element = userMatrix[key];
      let initial = replaceUnsupportedHtmlTags(element.initial);
      let description = replaceUnsupportedHtmlTags(element.description);
      await splitAndSendMessage(ctx, initial);
      await splitAndSendMessage(ctx, description);
    }
  }
};

export const startBot = (bot) => {
  let calculator;

  bot.command('start', async (ctx) => {
    await ctx.reply('Добро пожаловать!', Markup
    .keyboard(['Начать'])
    .resize());

    if (!ctx.session) {
      ctx.session = {};
    }
    ctx.session.step = 'day';

  });
  bot.hears('Начать', (ctx)=>{
    ctx.reply('Пожалуйста введите день вашего рождения (1-31):');
  })

  bot.on('text', async (ctx) => {  
    const input = ctx.message.text;
    if (!ctx.session){
      restartFlow(ctx);
      return;
    }
    if (ctx.session.step === 'day') {      
      ctx.session.day = await input;
      ctx.session.step = 'month';
      await ctx.reply('Введите месяц вашего рождения (1-12):');
    }else if (ctx.session.step === 'month') {
      ctx.session.month = await input;
      ctx.session.step = 'year';
      await ctx.reply('Введите год вашего рождения (например 2002):');
    }else if (ctx.session.step === 'year') {
      ctx.session.year = await input;
  
      if (isValidDate(ctx.session.year, ctx.session.month, ctx.session.day)) {
        await ctx.reply('Благодарим ожидайте...');
        calculator = new Calculator(ctx.session.day, ctx.session.month, ctx.session.year);
      } else {
        await ctx.reply('Дата введена неправильно');
        ctx.session.step = 'day';
        calculator=null;
      }
      if (!calculator) {
        restartFlow(ctx);
        return;
      }
          try{
            const imagePath = await generateImage(calculator);
            await ctx.replyWithPhoto({ source: createReadStream(imagePath) });
            const userMatrix = new UserMatrix(calculator,arcans,categories);
            await userMatrix.propInit();
            await sendHtmlMessage(ctx, userMatrix);
            //deleting image from filesystem
            unlink(imagePath, (err) => {
              if (err) {
                console.error('Error deleting file:', err);
              } else {
                console.log('File deleted:', imagePath);
              }
            }); 
            restartFlow(ctx);
          }catch(error){
            console.error('Error generating image:', error);
            restartFlow(ctx)
          }    
      };
    });

    function restartFlow(ctx) {
      ctx.session = {};
      calculator = null;
      ctx.session.step = 'day';  // Reset step to initial state
      ctx.reply('Ошибка');  // Send initial prompt to start over
      ctx.reply('Нажмите начать',Markup
      .keyboard(['Начать'])
      .resize())
    }

    bot.startPolling();
    console.log("Bot is start polling for updates ...")
};


export const webhookHandler = (req, res) => {
  bot.handleUpdate(req.body, res);
};
function isValidDate(year, month, day) {
  // Check the ranges of month and year
  if (year < 1000 || year > 3000 || month < 1 || month > 12) {
    return false;
  }
  const monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  // Adjust for leap years
  if (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)) {
    monthLength[1] = 29;
  }
  // Check the range of the day
  return day > 0 && day <= monthLength[month - 1];
}


