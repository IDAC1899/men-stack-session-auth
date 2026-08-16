const mongoose = require('mongoose');

// create the schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },
});
// initial the model

const User = mongoose.model('User', userSchema);

// export it
module.exports = User;