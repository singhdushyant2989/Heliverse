module.exports = (app) => {
    const quiz = require('../../controller/webApi/quiz.controller');
    router = require('express').Router();


    router.post('/', quiz.createQuiz);
    router.get('/active', quiz.getQuiz);
    router.get('/:id/result', quiz.getResult);
    router.get('/all', quiz.allQuiz);

    app.use('/quizzes', router);
}