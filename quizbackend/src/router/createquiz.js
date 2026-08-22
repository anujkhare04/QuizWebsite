
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



router.post('/create', authMiddleware, createQuiz)
router.post('/saved', Saved)  // analysis
router.get("/getsaved/:userId", getSaved);
router.get('/random', authMiddleware, random)
router.get('/mine', authMiddleware, getMyQuizzes)
router.get('/categories/:cat', authMiddleware, getByCategory)
router.get('/mixed', authMiddleware, getMixedCategories);
router.get('/categories', authMiddleware, getcategory);
router.post('/Aiques', Aiquestions);
router.post('/Aiques/file', upload.single("file"), AiquestionsFromFile);
router.post('/mock-test/topic', generateMockTestTopic);
router.post('/mock-test/evaluate', evaluateMockTest);
router.get("/performance/:userId", getPerformance);
router.get("/leaderboard", getLeaderboard);

module.exports = router

