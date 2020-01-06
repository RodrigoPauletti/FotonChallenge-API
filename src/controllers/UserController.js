const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Yup = require("yup");
const User = mongoose.model("User");

module.exports = {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
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

    const { email } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ error: "User already exists." });
    }

    req.body.password = bcrypt.hashSync(req.body.password, 8);
    const user = await User.create(req.body);

    return res.json(user);
  },

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Validation fails" });
    }
    const { email } = req.body;

    const user = await User.findById(req.userId);

    if (email !== user.email) {
      const userExists = await User.findOne({ email });

      if (userExists) {
        return res.status(400).json({ error: "User already exists." });
      }
    }

    const userUpdated = await user.updateOne(req.body);

    return res.json(userUpdated);
  }
};
