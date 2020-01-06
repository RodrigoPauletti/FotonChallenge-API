const mongoose = require("mongoose");

const Yup = require("yup");
const Task = mongoose.model("Task");

module.exports = {
  async index(req, res) {
    const { page = 1, filter = "" } = req.query;
    const tasks = await Task.paginate(
      {
        user: req.userId,
        $or: [
          {
            title: {
              $regex: ".*" + filter + ".*",
              $options: "i"
            }
          },
          {
            description: {
              $regex: ".*" + filter + ".*",
              $options: "i"
            }
          }
        ]
      },
      {
        page,
        limit: 10,
        sort: {
          updatedAt: -1,
          createdAt: -1
        }
      }
    );

    return res.json(tasks);
  },

  async show(req, res) {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(400).json({ error: "Task not found." });
    }

    if (!task.user.equals(req.userId)) {
      return res
        .status(400)
        .json({ error: "You don't have permission to see this task." });
    }

    return res.json(task);
  },

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string()
        .required()
        .min(5),
      description: Yup.string()
        .required()
        .min(10)
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Validation fails" });
    }

    const task = await await Task.create({ user: req.userId, ...req.body });

    return res.json(task);
  },

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string(),
      description: Yup.string()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Validation fails" });
    }

    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });

    return res.json(task);
  },

  async destroy(req, res) {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(400).json({ error: "Task not found." });
    }

    if (!task.user.equals(req.userId)) {
      return res
        .status(400)
        .json({ error: "You don't have permission to see this task." });
    }

    await task.remove();

    return res.send();
  }
};
