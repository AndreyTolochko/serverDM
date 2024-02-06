import { Schema, model } from 'mongoose';

const ArcansSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  variant:{
    type: String,
    required: false,
    enum: [
      "soul_to_parents", "relations_task","errors_in_relations","generic_power", "generic_task", "personal_purpose", "social_purpose","spiritual_purpose", "planetary_purpose"
    ]
  },
  description: {
    type: String,
    required: true,
  },
});
const Arcans = model("Arcans", ArcansSchema);
export default Arcans;

