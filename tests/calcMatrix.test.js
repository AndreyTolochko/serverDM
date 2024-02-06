import Calculator from "../utils/calcMatrix";


const calc = new Calculator("05","07","1997");

// Calculator class properties

describe("Calculator class properties tests", ()=>{
    test("Initializes the calculator and checks the properties of spiritualPurpose and Planetary purpose", ()=>{
        const calc = new Calculator("05","07","1997");
        
        expect(calc.DobSum.result).toBe(20);
        
    })
})