const mongoose=require('mongoose')

const quizSchema = new mongoose.Schema({
  title: String,
  category: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  questions: [
    {
      question: String,
      options: [String],
      correctAnswer: String,
    },
  ],
 
});

const quizmodel=mongoose.model("Quiz", quizSchema);
module.exports=quizmodel