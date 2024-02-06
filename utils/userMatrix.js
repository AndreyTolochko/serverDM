import mongoose from "mongoose";
import connectDB from "../database.js";
import Arcans from "../models/Arcans.js";
import Category from "../models/Category.js";
import Calculator from "./calcMatrix.js";

export default class UserMatrix {
  constructor(calculator, arcans, categories) {
    this.getCalc = () => {
      return calculator;
    };
    this.getArcans = () => {
      return arcans;
    };
    this.getCategories = (cat) => {
      const catMap = categories.reduce((acc, category) => {
        acc[category.name] = category._id;
        return acc;
      }, {});
      return catMap[cat];
    };
  }
  //Function filter record from category and title
  //Title it is digit and category name
  arcanFilter(title, category, variant = null) {
    try {
      const arcan = this.getArcans().find((arcan) => {
        const matchesTitleAndCategory =
          arcan.title === title.toString() &&
          arcan.category._id.toString() === category._id.toString();
        if (matchesTitleAndCategory && variant) {
          return (
            matchesTitleAndCategory && arcan.variant === variant
          );
        }
        return matchesTitleAndCategory;
      });

      return arcan ? arcan.description : null;
    } catch (err) {
      console.log(err);
      return "";
    }
  }

  //initialize properties
  async getMatrix() {
    try {
      const initial = "initial";
      return {
        character: {
          number: this.getCalc().Center.result,
          label: "Характер. Зона комфорта. Ваша суть.",
          initial: this.arcanFilter(
            initial,
            this.getCategories("character_pt")
          ),
          description: this.arcanFilter(
            this.getCalc().Center.result,
            this.getCategories("portret_pt")
          ),
          isFree: true,
        },
        portret: {
          number: this.getCalc().Day.result,
          label: "Портрет личности - как Вас видят люди.",
          initial: this.arcanFilter(initial, this.getCategories("portret_pt")),
          description: this.arcanFilter(
            this.getCalc().Day.result,
            this.getCategories("portret_pt")
          ),
          isFree: true,
        },
        essence: {
          number: this.getCalc().Month.result,
          label: "Высшая суть – что Вас вдохновляет и что вгоняет в депрессию.",
          initial: this.arcanFilter(initial, this.getCategories("essence_pt")),
          description: this.arcanFilter(
            this.getCalc().Month.result,
            this.getCategories("essence_pt")
          ),
          isFree: true,
        },
        material: {
          number: this.getCalc().Year.result,
          label: "Материальная карма прошлого - блокировка денежного потока",
          initial: this.arcanFilter(
            initial,
            this.getCategories("material_karma")
          ),
          description: `${this.arcanFilter(
            this.getCalc().Year.result,
            this.getCategories("material_karma")
          )}\n${this.arcanFilter(
            this.getCalc().financialLineMiddle.result,
            this.getCategories("material_karma")
          )}\n${this.arcanFilter(
            this.getCalc().financialLineSmall.result,
            this.getCategories("material_karma")
          )}`,
          isFree: false,
        },
        mainKarmaLesson: {
          number: this.getCalc().DobSum.result,
          label: "Главный кармический урок души.",
          initial: this.arcanFilter(initial, this.getCategories("karma_pt")),
          description: this.arcanFilter(
            this.getCalc().DobSum.result,
            this.getCategories("karma_pt")
          ),
          isFree: false,
        },
        karmaTail: {
          number: this.getCalc().carmaTail.result,
          label: "Ваш кармический хвост.",
          initial: this.arcanFilter(initial, this.getCategories("karma_tail")),
          description: this.arcanFilter(
            this.getCalc().carmaTail.result,
            this.getCategories("karma_tail")
          ),
          isFree: false,
        },
        relationCanal: {
          number: this.getCalc().hPoint.result,
          label: "Ваш канал отношений",
          initial: this.arcanFilter(initial, this.getCategories("relations")),
          description: this.arcanFilter(
            this.getCalc().hPoint.result,
            this.getCategories("relations")
          ),
          isFree: false,
        },
        financialCanal: {
          number: this.getCalc().oPoint.result,
          label: "Финансовый поток",
          initial: this.arcanFilter(initial, this.getCategories("finance")),
          description: this.arcanFilter(
            this.getCalc().oPoint.result,
            this.getCategories("finance")
          ),
          isFree: false,
        },
        fatherForce: {
          number: this.getCalc().sumDayMonth.result,
          label: "Сила рода по отцовской линии",
          initial: this.arcanFilter(
            initial,
            this.getCategories("generic_programs"),
            "generic_power"
          ),
          description: this.arcanFilter(
            this.getCalc().sumDayMonth.result,
            this.getCategories("generic_programs"),
            "generic_power"
          ),
          isFree: false,
        },
        motherForce: {
          number: this.getCalc().sumMonthYear.result,
          label: "Сила рода по материнской линии",
          description: this.arcanFilter(
            this.getCalc().sumMonthYear.result,
            this.getCategories("generic_programs"),
            "generic_power"
          ),
          isFree: false,
        },
        fatherTask: {
          number: this.getCalc().sumYearDob.result,
          label: "Задачи рода по отцовской линии",
          initial: this.arcanFilter(
            initial,
            this.getCategories("generic_programs"),
            "generic_task"
          ),
          description: this.arcanFilter(
            this.getCalc().sumYearDob.result,
            this.getCategories("generic_programs"),
            "generic_task"
          ),
          isFree: false,
        },
        motherTask: {
          number: this.getCalc().sumDobDay.result,
          label: "Задачи рода по материнской линии",
          description: this.arcanFilter(
            this.getCalc().sumDobDay.result,
            this.getCategories("generic_programs"),
            "generic_task"
          ),
        },
        spiritTalent: {
          number: this.getCalc().Month.result,
          label: "Ваш духовный талант",
          initial: this.arcanFilter(initial, this.getCategories("talent_zone")),
          description: this.arcanFilter(
            this.getCalc().Month.result,
            this.getCategories("talent_zone")
          ),
          isFree: false,
        },
        mindTalent: {
          number: this.getCalc().talentZoneMiddle.result,
          label: "Талант, связанный с вашим интеллектом и типом мышления",
          description: this.arcanFilter(
            this.getCalc().talentZoneMiddle.result,
            this.getCategories("talent_zone")
          ),
          isFree: false,
        },
        expressionTalent: {
          number: this.getCalc().talentZoneSmall.result,
          label: "Талант вашего самовыражения и коммуникации",
          description: this.arcanFilter(
            this.getCalc().talentZoneSmall.result,
            this.getCategories("talent_zone")
          ),
          isFree: false,
        },
        soulToParents: {
          number: this.getCalc().Day.result,
          label: "Для чего ваша душа пришла к родителям.",
          initial: this.arcanFilter(
            initial,
            this.getCategories("parents_child_channel"),
            "soul_to_parents"
          ),
          description: this.arcanFilter(
            this.getCalc().Day.result,
            this.getCategories("parents_child_channel"),
            "soul_to_parents"
          ),
          isFree: false,
        },
        parentsTasks: {
          number: this.getCalc().childParentsLineMiddle.result,
          label: "Задача отношений родителей с детьми.",
          initial: this.arcanFilter(
            initial,
            this.getCategories("parents_child_channel"),
            "relations_task"
          ),
          description: this.arcanFilter(
            this.getCalc().childParentsLineMiddle.result,
            this.getCategories("parents_child_channel"),
            "relations_task"
          ),
          isFree: false,
        },
        parentsErrors: {
          number: this.getCalc().childParentsLineSmall.result,
          label: "Ошибки во взаимоотношениях с родителями и своими детьми.",
          initial: this.arcanFilter(
            initial,
            this.getCategories("parents_child_channel"),
            "errors_in_relations"
          ),
          description: this.arcanFilter(
            this.getCalc().childParentsLineSmall.result,
            this.getCategories("parents_child_channel"),
            "errors_in_relations"
          ),
          isFree: false,
        },
        personalPurpose: {
          number: this.getCalc().personalPurpose.result,
          label: "Первое предназначение 0–40(лет)",
          initial: this.arcanFilter(
            initial,
            this.getCategories("purposes"),
            "personal_purpose"
          ),
          description: this.arcanFilter(
            this.getCalc().personalPurpose.result,
            this.getCategories("purposes"),
          ),
          isFree: false,
        },
        socialPurpose: {
          number: this.getCalc().socialPurpose.result,
          label: "Второе предназначение 40–60(лет)",
          initial: this.arcanFilter(
            initial,
            this.getCategories("purposes"),
            "social_purpose"
          ),
          description: this.arcanFilter(
            this.getCalc().socialPurpose.result,
            this.getCategories("purposes"),
          ),
          isFree: false,
        },
        spiritualPurpose:{
          number: this.getCalc().spiritualPurpose.result,
          label: "Третье предназначение 60 лет и выше",
          initial: this.arcanFilter(
            initial,
            this.getCategories("purposes"),
            "spiritual_purpose"
          ),
          description: this.arcanFilter(
            this.getCalc().spiritualPurpose.result,
            this.getCategories("purposes"),
          ),
          isFree: false,
        },
      };
    } catch (error) {
      console.error("Error initializing UserMatrix:", error);
      return { error: `${error}` };
    }
  }
}
