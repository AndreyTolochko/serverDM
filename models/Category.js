import { Schema, model } from 'mongoose';

const CategorySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  arcans: [{
    type: Schema.Types.ObjectId,
    ref:'Arcans'
  }],

});



const Category = model('Category', CategorySchema);
export default Category;