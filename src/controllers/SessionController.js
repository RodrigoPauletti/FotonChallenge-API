const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Yup = require("yup");

const User = mongoose.model("User");
const authConfig = require("../config/auth");

module.exports = {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6)
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Validation fails" });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "User not found." });
    }

    const passwordChecked = await bcrypt.compare(password, user.password);
    if (!passwordChecked) {
      return res.status(401).json({ error: "Password does not match." });
    }

    const { _id, name } = user;

    return res.json({
      user: {
        _id,
        name,
        email
      },
      token: jwt.sign({ _id, name }, authConfig.secret, {
        expiresIn: authConfig.expiresIn
      })
    });
  }
};
