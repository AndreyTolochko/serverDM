import Calculator from "./calcMatrix.js";


const start = new Date("01/01/1000")
const end = new Date("01/01/2024");

const smallFirst = [];
const smallLast = [];

let loop = new Date(start);
while (loop <= end) {
  const calc = new Calculator(
    loop.getDate(),
    loop.getMonth() + 1,
    loop.getFullYear()
  );

  let karmaSmallFirst = `${calc.carmaTailSmall.result}/${calc.carmaTailMiddle.result}/${calc.DobSum.result}`
  smallFirst.push(karmaSmallFirst);
  let karmaSmallLast = `${calc.DobSum.result}/${calc.carmaTailMiddle.result}/${calc.carmaTailSmall.result}`
  smallLast.push(karmaSmallLast)
  let newDate = loop.setDate(loop.getDate() + 1);
  loop = new Date(newDate);
}
let uniqueSmallFirst = [...new Set(smallFirst)];
let uniqueSmallLast = [...new Set(smallLast)];
const etalon = [
  '9/12/3','12/16/4','15/20/5','18/6/6',
  '21/10/7','6/14/8','9/18/9','3/13/10',
  '6/17/11','18/3/12','21/7/13','6/20/14',
  '18/6/15','21/10/16', '6/5/17','9/9/18',
  '3/22/19','6/8/20','9/3/21','3/7/22',
  '9/15/6', '12/19/7', '15/5/8','18/9/9',
  '21/4/10','15/8/11'
]


const standart=(str)=>{
  return str.split('/').map(num => parseInt(num, 10)).sort((a, b) => a-b).join('/');
}


//const etalonSorted = etalon.map(standart);
//const uniqueSmallFirstSorted = uniqueSmallFirst.map(standart);
//const uniqueSmallLastSorted = uniqueSmallLast.map(standart)

const smallFirstMissing = uniqueSmallFirst.filter(value => !etalon.includes(value));

const smallLastMissing = uniqueSmallLast.filter(value => !etalon.includes(value))
//console.log(`calculated values:\n ${[...uniqueKarmaArray]}`);
console.log(`Missing values first small:\n${smallFirstMissing}`);
console.log(`Missing values small last:\n${smallLastMissing}`);

console.log(`Etalon values:\n${[...etalon]}\n`);

console.log(`Small first: \n ${[...uniqueSmallFirst]}\n`);

console.log(`Small last:\n ${[...uniqueSmallLast]}\n`)


//  CONCLUSION THAT FIRST VALUE IN KARMA SEQUENCE SHALL BE SMALL DIGIT AND MIDDLE AND THE LAST IS MAIN KARMA POINT 