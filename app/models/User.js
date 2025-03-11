import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  country: { type: String, required: true },
  state: { type: String, required: true },
  countryName:{ type: String, required: true },
  stateName:{ type: String, required: true },
  lastSeen: { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
