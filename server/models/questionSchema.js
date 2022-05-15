const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema({
    // id:{
    //     type: Number,
    //     required: true,
    //     unique: true
    // },
    question:{
        type: String,
        required: true
    },
    options:{
        type: Object,
        required: true
    },
    correctOption:{
        type: String,
        required: true
    }
})

const Question = mongoose.model("Question",QuizSchema)
module.exports = Question