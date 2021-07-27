const Quizzes = require("../models/quizModel");

class QuizController {
  static getQuizHandler(req, res, next) {
    Quizzes.findAll(req.user.id)
      .then((result) => {
        res.status(200).send(result);
      })
      .catch((err) => {
        next(err);
      });
  }

  static getQuizByIdHandler(req, res, next) {
    const { id } = req.params;
    if (id.length !== 24) {
      next({ code: 400, message: ["id should be 24 hex characters"] });
    }

    Quizzes.findOne(id)
      .then((result) => {
        if (result) {
          res.status(200).send(result);
        } else {
          next({ code: 404, message: ["Quiz not found"] });
        }
      })
      .catch((err) => {
        next(err);
      });
  }

  static postQuizHandler(req, res, next) {
    let payload = {
      ...req.body,
      userId: req.user.id
    }

    Quizzes.postQuiz(payload)
      .then((result) => {
        if (result.message === undefined) {
          res.status(201).send(result);
        } else {
          next({ code: 400, message: result.message });
        }
      })
      .catch((err) => {
        next(err);
      });
  }

  static putQuizHandler(req, res, next) {
    let payload = {
      ...req.body,
      userId: req.user.id
    }
    //di uncomment kalau sudah di merge dengan middleware login
    // payload.userId = req.user.id

    const { id } = req.params;

    if (id.length !== 24) {
      next({ code: 400, message: ["id should be 24 hex characters"] });
    }

    Quizzes.putQuiz(payload, id)
      .then((result) => {
        if (result.matchedCount === 1) {
          res.status(200).send(result);
        } else if (result.matchedCount == 0) {
          next({ code: 404, message: ["Quiz not found"] });
        } else {
          next({ code: 400, message: result.message });
        }
      })
      .catch((err) => {
        next(err);
      });
  }

  static deleteQuizHandler(req, res, next) {
    const { id } = req.params;

    if (id.length !== 24) {
      next({ code: 400, message: ["id should be 24 hex characters"] });
    }

    Quizzes.deleteQuiz(id)
      .then((result) => {
        if (result.deletedCount !== 0) {
          res.status(200).send({
            message: `quiz with id ${id} deleted successfully`,
          });
        } else {
          next({ code: 404, message: ["quiz not found"] });
        }
      })
      .catch((err) => {
        next(err);
      });
  }
}

module.exports = QuizController;
