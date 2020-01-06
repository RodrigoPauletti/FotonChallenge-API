const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      index: {
        unique: true
      },
      required: true
    },
    password: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

UserSchema.methods.toJSON = function() {
  var obj = this.toObject();
  delete obj.password;
  return obj;
};

mongoose.model("User", UserSchema);
