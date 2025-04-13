const Quiz = require("../DB/schemas/quiz.schema");
const Question = require("../DB/schemas/question.schema");

const create_quiz = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      timeLimit,
      questions: questionIds,
    } = req.body;

    if (!req.user || !req.user.id) {
      return res
        .status(401)
        .json({ status: "failed", message: "Authentication required." });
    }
    const createdByUserId = req.user.id;

    if (questionIds && questionIds.length > 0) {
      const foundQuestions = await Question.find({
        _id: { $in: questionIds },
      }).select("_id");

      if (foundQuestions.length !== questionIds.length) {
        const foundIds = foundQuestions.map((q) => q._id.toString());
        const invalidIds = questionIds.filter((id) => !foundIds.includes(id));
        return res.status(400).json({
          status: "failed",
          message:
            "Validation failed: One or more provided question IDs do not exist.",
          invalidQuestionIds: invalidIds,
        });
      }
    }

    const new_quiz = new Quiz({
      title,
      description,
      category,
      timeLimit,
      questions: questionIds,
      createdBy: createdByUserId,
    });

    await new_quiz.save();

    const populatedQuiz = await Quiz.findById(new_quiz._id)
      .populate("questions")
      .populate("createdBy", "username email");

    res
      .status(201)
      .json({ status: "success", data: populatedQuiz || new_quiz });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((el) => el.message);
      return res
        .status(400)
        .json({
          status: "failed",
          message: "Database validation failed",
          errors: errors,
        });
    }
    res
      .status(500)
      .json({ status: "failed", message: "Failed to create quiz." });
  }
};

const get_all_quizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find()
      .select("-questions")
      .populate("createdBy", "username");
    res.status(200).json({ status: "success", data: quizzes });
  } catch (error) {
    res
      .status(500)
      .json({ status: "failed", message: "Failed to retrieve quizzes." });
  }
};

const get_quiz = async (req, res) => {
  try {
    const { id } = req.params;
    const quiz = await Quiz.findById(id)
      .populate("questions")
      .populate("createdBy", "username email");

    if (!quiz) {
      return res
        .status(404)
        .json({ status: "failed", message: "Quiz not found" });
    }
    res.status(200).json({ status: "success", data: quiz });
  } catch (error) {
    res
      .status(500)
      .json({ status: "failed", message: "Failed to retrieve quiz details." });
  }
};

const update_quiz = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!req.user || !req.user.id) {
      return res
        .status(401)
        .json({ status: "failed", message: "Authentication required." });
    }

    if (updateData.questions && updateData.questions.length > 0) {
      const foundQuestions = await Question.find({
        _id: { $in: updateData.questions },
      }).select("_id");
      if (foundQuestions.length !== updateData.questions.length) {
        const foundIds = foundQuestions.map((q) => q._id.toString());
        const invalidIds = updateData.questions.filter(
          (id) => !foundIds.includes(id)
        );
        return res.status(400).json({
          status: "failed",
          message:
            "Validation failed: One or more provided question IDs do not exist.",
          invalidQuestionIds: invalidIds,
        });
      }
    }

    const quiz = await Quiz.findById(id);
    if (!quiz) {
      return res
        .status(404)
        .json({ status: "failed", message: "Quiz not found" });
    }

    delete updateData.createdBy;

    const updatedQuiz = await Quiz.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("questions")
      .populate("createdBy", "username email");

    res.status(200).json({ status: "success", data: updatedQuiz });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((el) => el.message);
      return res
        .status(400)
        .json({
          status: "failed",
          message: "Database validation failed",
          errors: errors,
        });
    }
    res
      .status(500)
      .json({ status: "failed", message: "Failed to update quiz." });
  }
};

const delete_quiz = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.user || !req.user.id) {
      return res
        .status(401)
        .json({ status: "failed", message: "Authentication required." });
    }

    const quiz = await Quiz.findById(id);
    if (!quiz) {
      return res
        .status(404)
        .json({ status: "failed", message: "Quiz not found" });
    }

    const deletedQuiz = await Quiz.findByIdAndDelete(id);

    res
      .status(200)
      .json({
        status: "success",
        message: "Quiz deleted successfully",
        data: deletedQuiz,
      });
  } catch (error) {
    res
      .status(500)
      .json({ status: "failed", message: "Failed to delete quiz." });
  }
};

module.exports = {
  create_quiz,
  get_all_quizzes,
  get_quiz,
  update_quiz,
  delete_quiz,
};
