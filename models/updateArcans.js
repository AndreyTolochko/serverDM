const Category =require("./Category.js");
const Arcans =require("./Arcans.js");
const connectDB =require("../database.js");
const mongoose =require("mongoose");

connectDB()

const uniqueCategories = ["character_pt","portret_pt", "essence_pt", "material_pt", "karma_pt", "talent_zone", "parents_child_channel", "generic_programs", "karma_tail",  "relations","finance", "purposes"];

const arcansDocuments = await Arcans.find({ category: { $type: 'string' } });
const categories = await Category.find({});
const categoryMap = categories.reduce((acc, category) => {
  acc[category.name] = category._id;
  return acc;
}, {});

for (const document of arcansDocuments) {
    const categoryName = document.category;
    const categoryId = categoryMap[categoryName];
  
    if (categoryId) {
      document.category = new mongoose.Types.ObjectId(categoryId);
      await document.save();
    } else {
      console.error(`Category ID not found for category name: ${categoryName}`);
    }
  }