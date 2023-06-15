const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    ques: String,
    option: Array,
    ans : String,
    stdate: Date,
    endate: Date,
    status: {
        type: String,
        enum: ['inactive', 'active', 'finished'],
        default: 'inactive'
    }
});

quizSchema.methods.updateStatus = function() {
    const now = new Date();
    if (now < this.stdate) {
      this.status = 'inactive';
    } else if (now > this.endate) {
      this.status = 'finished';
    } else {
      this.status = 'active';
    }
};

module.exports = mongoose.model('quizDetails',quizSchema);