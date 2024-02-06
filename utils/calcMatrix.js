import connectDB from "../database.js";
import Arcans from "../models/Arcans.js";
import Category from "../models/Category.js";


class Calculator {
  constructor(day, month, year) {
    this.fontSizeLarge = 38;
    this.fontSizeMiddle = 34;
    this.fontSizeSmall = 26;
    const initial='initial';
    // Personality portret, Part of child parents Line
    this.Day = {
      position: [143, 432],
      name:"portret_pt",
      result: this.productNumbers(parseInt(day)),
      fontSize: this.fontSizeLarge,
      initial:'',
      description: ''
    };
    // Higher essence, connection with the Guardian Angel, Part of talant zone Line
    //For now all names in Main points set to portret_pt because they will be the same
    this.Month = {
      position: [475, 100],
      name:"portret_pt",
      result: parseInt(month, 10),
      fontSize: this.fontSizeLarge,
      initial:'',
      description:'',
    };
    // Material karma of the past incarnation, Part of financial Line,
    this.Year = {
      position: [807, 432],
      name:"portret_pt",
      result: this.productNumbers(parseInt(year)),
      fontSize: this.fontSizeLarge,
    };
    // Main karma lesson. Main part of Carma tail Line
    this.DobSum = {
      position: [475, 765],
      name:"portret_pt",
      result: this.productNumbers(
        this.Day.result + this.Month.result + this.Year.result
      ),
      fontSize: this.fontSizeLarge,
    };

    // Character
    this.Center = {
      position: [475, 432],
      name:"portret_pt",
      result: this.productNumbers(
        this.Day.result +
          this.Month.result +
          this.Year.result +
          this.DobSum.result
      ),
      fontSize: this.fontSizeLarge,
      category: "character_pt",
      description: "",
    };

    // Upper part of the father line
    this.sumDayMonth = {
      position: [241, 196],
      result: this.productNumbers(this.Day.result + this.Month.result),
      fontSize: this.fontSizeLarge,
      description: "",
    };

    // Upper part of mother line
    this.sumMonthYear = {
      position: [710, 197],
      result: this.productNumbers(this.Month.result + this.Year.result),
      fontSize: this.fontSizeLarge,
      description: "",
    };
    // Lower part of the father line
    this.sumYearDob = {
      position: [710, 667],
      result: this.productNumbers(this.Year.result + this.DobSum.result),
      fontSize: this.fontSizeLarge,
      description: "",
    };
    //Lower part of the mother line
    this.sumDobDay = {
      position: [239, 666],
      result: this.productNumbers(this.DobSum.result + this.Day.result),
      fontSize: this.fontSizeLarge,
      description: "",
    };
    // Line of the sky
    this.skyLine = {
      result:this.productNumbers(this.Month.result + this.DobSum.result)}
    // Line of the earth
    this.landLine = {
      result:this.productNumbers(this.Day.result + this.Year.result)
    }
    // Personal purpose
    this.personalPurpose = {
      result: this.productNumbers(this.landLine.result + this.skyLine.result)
    },

    this.fatherLine = {
      result:this.productNumbers(
      this.sumDayMonth.result + this.sumYearDob.result
    )}

    this.motherLine = {
      result:this.productNumbers(
      this.sumDobDay.result + this.sumMonthYear.result
    )
  }

    this.socialPurpose = {
      result: this.productNumbers(this.motherLine.result + this.fatherLine.result)

    };

    this.spiritualPurpose = {
      result: this.productNumbers(this.personalPurpose.result + this.socialPurpose.result)
    };

    this.planetaryPurpose = {
      result: this.productNumbers(this.spiritualPurpose.result + this.socialPurpose.result)
    };
    this.carmaTailSmall = {
      position: [475, 656],
      result: this.productNumbers(this.DobSum.result + this.Center.result),
      fontSize: this.fontSizeSmall,
    };

    this.carmaTailMiddle = {
      position: [475, 700],
      result: this.productNumbers(
        this.DobSum.result + this.carmaTailSmall.result
      ),
      fontSize: this.fontSizeMiddle,
    };

    this.carmaTail = {
      result: `${this.carmaTailSmall.result}/${this.carmaTailMiddle.result}/${this.DobSum.result}`
    }

    this.talentZoneSmall = {
      position: [475, 209],
      result: this.productNumbers(this.Month.result + this.Center.result),
      fontSize: this.fontSizeSmall,
    };
    this.talentZoneMiddle = {
      position: [475, 163],
      result: this.productNumbers(
        this.Month.result + this.talentZoneSmall.result
      ),
      fontSize: this.fontSizeMiddle,
    };
    this.financialLineSmall = {
      position: [698, 432],
      result: this.productNumbers(this.Year.result + this.Center.result),
      fontSize: this.fontSizeSmall,
    };
    //B point
    this.financialLineMiddle = {
      position: [743, 432],
      result: this.productNumbers(
        this.Year.result + this.financialLineSmall.result
      ),
      fontSize: this.fontSizeMiddle,
    };
    //M point
    this.mPoint = {
      position: [578, 535],
      result: this.productNumbers(
        this.financialLineSmall.result + this.carmaTailSmall.result
      ),
      fontSize: this.fontSizeSmall,
    };
    //H point
    this.hPoint = {
      position: [566, 588],
      result: this.productNumbers(
        this.carmaTailSmall.result + this.mPoint.result
      ),
      fontSize: this.fontSizeSmall,
    };
    //O point
    this.oPoint = {
      position: [632, 522],
      result: this.productNumbers(
        this.financialLineSmall.result + this.mPoint.result
      ),
      fontSize: this.fontSizeSmall,
    };
    // fathers Line upper part lower digit
    this.fatherLineUpperSmall = {
      position: [317, 274],
      result: this.productNumbers(this.sumDayMonth.result + this.Center.result),
      fontSize: this.fontSizeSmall,
    };
    // fathers Line upper part middle digit
    this.fatherLineUpperMiddle = {
      position: [285, 242],
      result: this.productNumbers(
        this.sumDayMonth.result + this.fatherLineUpperSmall.result
      ),
      fontSize: this.fontSizeMiddle,
    };
    //fathers Line lower part lower digit
    this.fatherLineLowerSmall = {
      position: [633, 590],
      result: this.productNumbers(this.sumYearDob.result + this.Center.result),
      fontSize: this.fontSizeSmall,
    };
    //fathers Line lower part middle digit
    this.fatherLineLowerMiddle = {
      position: [665, 621],
      result: this.productNumbers(
        this.sumYearDob.result + this.fatherLineLowerSmall.result
      ),
      fontSize: this.fontSizeMiddle,
    };
    // mothers Line upper part lower digit
    this.motherLineUpperSmall = {
      position: [633, 274],
      result: this.productNumbers(
        this.sumMonthYear.result + this.Center.result
      ),
      fontSize: this.fontSizeSmall,
    };
    // mothers Line upper part middle digit
    this.motherLineUpperMiddle = {
      position: [665, 242],
      result: this.productNumbers(
        this.sumMonthYear.result + this.motherLineUpperSmall.result
      ),
      fontSize: this.fontSizeMiddle,
    };
    // mothers Line lower part lower digit
    this.motherLineLowerSmall = {
      position: [317, 590],
      result: this.productNumbers(this.sumDobDay.result + this.Center.result),
      fontSize: this.fontSizeSmall,
    };
    //mothers Line lower part middle digit
    this.motherLineLowerMiddle = {
      position: [285, 621],
      result: this.productNumbers(
        this.sumDobDay.result + this.motherLineLowerSmall.result
      ),
      fontSize: this.fontSizeMiddle,
    };

    // child-parents Line lower part
    this.childParentsLineSmall = {
      position: [251, 432],
      result: this.productNumbers(this.Day.result + this.Center.result),
      fontSize: this.fontSizeSmall,
    };
    // child-parents Line middle part
    this.childParentsLineMiddle = {
      position: [206, 432],
      result: this.productNumbers(
        this.Day.result + this.childParentsLineSmall.result
      ),
      fontSize: this.fontSizeMiddle,
    };
  }


  calculateYears = () =>{
    return '';
  }

  sumDigits = (number) => {
    const digits = number.toString().split("").map(Number);
    return digits.reduce((sum, digit) => sum + digit, 0);
  };

  //Finding the product of numbers
  productNumbers = (number) => {
    if (parseInt(number) > 22) {
      number = this.sumDigits(number);
      if (number > 22) {
        number = this.sumDigits(number);
      }
    }
    return parseInt(number);
  };
}

export default Calculator;

