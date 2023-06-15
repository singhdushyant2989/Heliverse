const mongodb = require('mongodb');
const quiz = require('../../model/webApi/quiz');

const rateLimit = require('express-rate-limit');

const cron = require('node-cron');

// Set up rate-limiting middleware
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 requests per minute
  message: 'Too many requests, please try again later'
});

// Run the updateStatus function every minute
cron.schedule('*/10 * * * * *', async () => {
  try {
    const quizzes = await quiz.find();
    quizzes.forEach(quiz => {
      quiz.updateStatus();
      quiz.save();
    });
  } catch (err) {
    console.error(err);
  }
});


exports.createQuiz = async (req, res) => {
    var data = new quiz ({
        'ques': req.body.ques,
        'option': req.body.option,
        'ans' : req.body.ans,
        'stdate': req.body.stdate,
        'endate': req.body.endate,
    });
    

    data.save()
    .then(() => {
      res.status(201).json({ message: 'Quiz created successfully' });
    })
    .catch((error) => {
      res.status(500).json({ message: 'Error creating quiz', error: error });
    });
}

exports.getQuiz = async (req, res) => {
    const now = new Date();
    try {
        const quizzes = await quiz.find({
        stdate: { $lte: now },
        endate: { $gte: now },
        status: 'active'
        });
        if (!quizzes) {
        res.status(404).send('No active quiz found');
        } else {
        res.send(quizzes);
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
}

exports.getResult = async (req, res) => {
    try {
        const quizt = await quiz.findById({'_id': new mongodb.ObjectId(req.params.id)});
        if (!quizt) {
          return res.status(404).json({ message: 'Quiz not found' });
        } else if (quizt.status !== 'finished') {
          return res.status(400).json({ message: 'Quiz result not available yet' });
        } else {
            var arr = {
                'Question' : quizt.ques,
                'Answer' : quizt.ans,
            }
            res.send(arr);
        }
      } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
      }
}

exports.allQuiz = async (req, res) => {
    try {
        const quizzes = await quiz.find();
        res.send(quizzes);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
}