let mongoose = require("mongoose");

let TowerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  kingdom: { type: String, required: true },
  ql: { type: Number, default: 1 },
  capital: { type: Boolean, default: false },
});
TowerSchema.index({ x: 1, y: 1 }, { unique: true });

module.exports = mongoose.model("Tower", TowerSchema);
