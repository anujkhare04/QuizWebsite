
const express = require("express")
const multer = require("multer");
const { authMiddleware } = require("../../middleware/authuser");
const {
  getPerformance,
  getLeaderboard,
  getSaved,
  Saved,
  Aiquestions,
  AiquestionsFromFile,
  createQuiz,
  random,
  getByCategory,
  getMyQuizzes,
  getMixedCategories,
  getcategory,
  generateMockTestTopic,
  evaluateMockTest
} = require('../controller/createquiz')

const router = express.Router()
const upload = multer({ storage: multer.memoryStorage() });


//Quiz

router.post('/create', authMiddleware, createQuiz)
router.post('/saved', Saved)  // analysis
router.get("/getsaved/:userId", getSaved);
router.get('/mine', authMiddleware, getMyQuizzes)
router.get('/categories/:cat', authMiddleware, getByCategory)


router.get('/categories', authMiddleware, getcategory);  //List of category names from mine
router.get('/random', random)            // One random quiz
router.get('/mixed', authMiddleware, getMixedCategories); // One random quiz per category from mine


//Ai
router.post('/Aiques', Aiquestions);
router.post('/Aiques/file', upload.single("file"), AiquestionsFromFile);

//mock-test

router.post('//topic', generateMockTestTopic);
router.post('/mock-test/evaluate', evaluateMockTest);

//Stats
router.get("/performance/:userId", getPerformance);
router.get("/leaderboard", getLeaderboard);

module.exports = router

