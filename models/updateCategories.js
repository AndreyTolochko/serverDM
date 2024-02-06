const mongoose = require('mongoose');
const Category = require('./Category.js');
const Arcans = require('./Arcans.js');
const connectDB = require('../database.js');

connectDB();

async function updateCategories() {
  try {
    // Step 1: Remove the description field from all categories
    await Category.updateMany({}, { $unset: { description: 1 } });

    // Step 2: Find all arcans and categorize them by category ObjectId
    const arcansList = await Arcans.find({}).populate('category');
    
    const categoryMap = {};
    for (const arcan of arcansList) {
      if (arcan.category) {
        const categoryId = arcan.category._id.toString();
        if (!categoryMap[categoryId]) {
          categoryMap[categoryId] = [];
        }
        categoryMap[categoryId].push(arcan._id);
      }
    }

    // Step 3: Update each category with the corresponding arcans ids
    for (const [categoryId, arcansIds] of Object.entries(categoryMap)) {
      await Category.updateOne({ _id: new mongoose.Types.ObjectId(categoryId) }, { $set: { arcans: arcansIds } });
    }

    console.log('Categories updated successfully.');
  } catch (error) {
    console.error('Error updating categories:', error);
  } finally {
    mongoose.connection.close();
  }
}

updateCategories();
