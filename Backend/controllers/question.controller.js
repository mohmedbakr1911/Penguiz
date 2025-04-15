const Question = require("../DB/schemas/question.schema");

const create_question = async (req, res) => {
  try {
    const { text, options, correctAnswer, category } = req.body;

    if (!req.user || !req.user.id) {
      return res
        .status(401)
        .json({ status: "failed", message: "Authentication required." });
    }
    const createdByUserId = req.user.id;

    const newQuestion = new Question({
      text,
      options,
      correctAnswer,
      category,
      createdBy: createdByUserId,
    });

    await newQuestion.save();
    await newQuestion.populate("createdBy", "username email");
    return res.status(201).json({ status: "success", newQuestion }); // <-- return added here too (good habit)
  } catch (error) {
    console.error(error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((el) => el.message);
      return res.status(400).json({
        status: "failed",
        message: "Database validation failed",
        errors: errors,
      });
    }

    return res
      .status(500)
      .json({ status: "failed", message: "Failed to create question." });
  }
};


const get_all_questions = async (req, res) => {
  try {
    const questions = await Question.find().populate("createdBy", "username");
    res.status(200).json({ status: "success", questions });
  } catch (error) {
    return res
      .status(500)
      .json({ status: "failed", message: "Failed to retrieve questions." });
  }
};

const get_question = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await Question.findById(id).populate(
      "createdBy",
      "username email"
    );

    if (!question) {
      return res
        .status(404)
        .json({ status: "failed", message: "Question not found" });
    }
    res.status(200).json({ status: "success", question });
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: "Failed to retrieve question details.",
    });
  }
};

const update_question = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!req.user || !req.user.id) {
      return res
        .status(401)
        .json({ status: "failed", message: "Authentication required." });
    }

    const question = await Question.findById(id);
    if (!question) {
      return res
        .status(404)
        .json({ status: "failed", message: "Question not found" });
    }

    delete updateData.createdBy;

    const updatedQuestion = await Question.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate("createdBy", "username email");

    res.status(200).json({ status: "success", updatedQuestion });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((el) => el.message);
      return res.status(400).json({
        status: "failed",
        message: "Database validation failed",
        errors: errors,
      });
    }
    res
      .status(500)
      .json({ status: "failed", message: "Failed to update question." });
  }
};

const delete_question = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.user || !req.user.id) {
      return res
        .status(401)
        .json({ status: "failed", message: "Authentication required." });
    }

    const question = await Question.findById(id);
    if (!question) {
      return res
        .status(404)
        .json({ status: "failed", message: "Question not found" });
    }

    const deletedQuestion = await Question.findByIdAndDelete(id);

    res
      .status(200)
      .json({ status: "success", message: "Question deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ status: "failed", message: "Failed to delete question." });
  }
};

module.exports = {
  create_question,
  get_all_questions,
  get_question,
  update_question,
  delete_question,
};
