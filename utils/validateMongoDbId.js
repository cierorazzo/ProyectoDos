const mongoose = require("mongoose");
const validateMongoById = (id) => {
  const isValid = mongoose.Types.ObjectId.isValid(id);
  if (!isValid) throw new Error(`Id inválido: ${id}`)
};
module.exports = validateMongoById;