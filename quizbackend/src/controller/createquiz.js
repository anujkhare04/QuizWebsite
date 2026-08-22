const mongoose = require('mongoose');
const Quiz = require('../model/createquizmodel')
const Score = require('../model/Score')
const User = require('../../model/auth')

module.exports.createQuiz = async (req, res) => {
    try {
    const quiz = await Quiz.create({
      title: req.body.title,
      category: req.body.category,
      questions: req.body.questions,
      createdBy: req.userId,
    });
        res.json(quiz);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports.Saved = async (req, res) => {
  try {
    const saved = await Score.create(req.body);
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.getSaved=async(req,res)=>{
    try {

        const userId=req.params.userId;
       const getsaved = await Score.find({ userId });

        

        if(!getsaved.length){
            return res.status(400).json({
                message:"Score data not found"
            })}


            return res.status(200).json({
                message:"succcesfully score data found",getsaved
            })
        
    } catch (error) {
        return res.status(500).json({
                message:error.message
            })
    }
}


const { getUserPerformance } = require("../service/service");

module.exports.getPerformance = async (req, res) => {
  try {
    const { userId } = req.params;
      const range = req.query.range || "yearly";
      const result = await getUserPerformance(userId, range);
    

   res.status(200).json(result);
   
  } catch (error) {
    res.status(500).json({ message: "Error calculating performance" });
  }
};

module.exports.getLeaderboard = async (req, res) => {
  try {
    const { range = "global", limit = 50 } = req.query;
    const parsedLimit = Math.max(1, Math.min(Number(limit) || 500, 5000));

    const match = {};
    if (range === "weekly" || range === "monthly") {
      const now = new Date();
      const start = new Date();
      start.setDate(now.getDate() - (range === "weekly" ? 7 : 30));
      match.attemptedAt = { $gte: start, $lte: now };
    }

    const grouped = await Score.aggregate([
      Object.keys(match).length ? { $match: match } : { $match: {} },
      {
        $project: {
          userId: {
            $trim: {
              input: { $toString: "$userId" },
            },
          },
          attemptedAt: 1,
          attemptedCount: {
            $size: {
              $filter: {
                input: "$answers",
                as: "a",
                cond: { $ne: ["$$a.selectedOption", null] },
              },
            },
          },
          correctCount: {
            $size: {
              $filter: {
                input: "$answers",
                as: "a",
                cond: { $eq: ["$$a.isCorrect", true] },
              },
            },
          },
        },
      },
      {
        $group: {
          _id: "$userId",
          totalQuizzes: { $sum: 1 },
          totalAttempted: { $sum: "$attemptedCount" },
          totalCorrect: { $sum: "$correctCount" },
          bestScore: { $max: "$correctCount" },
          attemptsDates: { $push: "$attemptedAt" },
        },
      },
    ]);

    const userIds = grouped
      .map((u) => u._id)
      .filter((id) => mongoose.Types.ObjectId.isValid(id))
      .map((id) => new mongoose.Types.ObjectId(id));

    const users = await User.find({ _id: { $in: userIds } }).select("username img").lean();
    const userMap = new Map(users.map((u) => [String(u._id), u]));

    const withMetrics = grouped.map((u) => {
      const userData = userMap.get(String(u._id)) || {};
      const accuracy = u.totalAttempted === 0 ? 0 : (u.totalCorrect / u.totalAttempted) * 100;
      const wrong = Math.max(u.totalAttempted - u.totalCorrect, 0);
      const points = u.totalCorrect * 10 - wrong * 2;

      const uniqueDays = [...new Set((u.attemptsDates || []).map((d) => new Date(d).toDateString()))].sort(
        (a, b) => new Date(a) - new Date(b)
      );
      let streak = 0;
      const checkDate = new Date();
      while (true) {
        const dayStr = checkDate.toDateString();
        if (uniqueDays.includes(dayStr)) {
          streak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }

      const uniqueDaysSorted = uniqueDays.sort((a, b) => new Date(a) - new Date(b));
      let bestStreak = 0;
      let currentRun = 0;
      let previousDate = null;
      uniqueDaysSorted.forEach((day) => {
        const date = new Date(day);
        if (previousDate && (date - previousDate) / (1000 * 60 * 60 * 24) === 1) {
          currentRun += 1;
        } else {
          currentRun = 1;
        }
        bestStreak = Math.max(bestStreak, currentRun);
        previousDate = date;
      });

      const level = Math.max(
        1,
        Math.floor((u.totalQuizzes * 8 + accuracy * 4 + (u.bestScore || 0) * 0.5) / 120) + 1
      );

      return {
        id: String(u._id).trim(),
        username: userData.username || null,
        avatar: userData.img || "",
        points: Number(points.toFixed(0)),
        accuracy: Number(accuracy.toFixed(1)),
        streak,
        bestStreak,
        level,
        totalQuizzes: u.totalQuizzes,
        bestScore: u.bestScore || 0,
      };
    });

    const sorted = withMetrics
      .sort((a, b) => (b.points - a.points) || (b.accuracy - a.accuracy) || (b.bestStreak - a.bestStreak))
      .slice(0, parsedLimit)
      .map((u, i) => ({ ...u, rank: i + 1 }));

    return res.status(200).json({ range, leaderboard: sorted });
  } catch (error) {
    return res.status(500).json({ message: "Error generating leaderboard", details: error.message });
  }
};






module.exports.random = async (req, res) => {

    try {
    const getquiz = await Quiz.aggregate([
      { $sample: { size: 1 } },
    ])
        if (!getquiz.length) {
            return res.status(404).json({ message: "No quizzes found" });
        }
        res.json(getquiz[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports.getByCategory = async (req, res) => {
    try {
        const { cat } = req.params;
  const ownerFilter = req.query.scope === "mine" ? { createdBy: req.userId } : {};
  const quizzes = await Quiz.find({ category: cat, ...ownerFilter });
        res.json(quizzes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports.getMyQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ createdBy: req.userId })
      .sort({ _id: -1 })
      .lean();
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports.getMixedCategories = async (req, res) => {
    try {

    const ownerFilter = req.query.scope === "mine" ? { createdBy: req.userId } : {};
    const categories = await Quiz.distinct("category", ownerFilter);

        if (!categories.length) {
            return res.status(404).json({ message: "No categories found" });
        }


        const mixedQuizzes = await Promise.all(
            categories.map(async (cat) => {
                const quiz = await Quiz.aggregate([
                    { $match: { category: cat, ...ownerFilter } },
                    { $sample: { size: 1 } }
                ]);
                return quiz[0];
            })
        );

        res.json(mixedQuizzes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


module.exports.getcategory = async (req, res) => {
    try {
        // get all distinct categories from quizzes
    const ownerFilter = req.query.scope === "mine" ? { createdBy: req.userId } : {};
    const categories = await Quiz.distinct("category", ownerFilter);

        if (!categories.length) {
            return res.status(404).json({ message: "No categories found" });
        }

        res.json(categories); // send array of category names
    } catch (err) {
        console.error("Error fetching categories:", err);
        res.status(500).json({ error: err.message });
    }
};


const { GoogleGenerativeAI } = require("@google/generative-ai");
const pdfParse = require("pdf-parse");

const parseAiJsonArray = (text) => {
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error("Invalid JSON returned by AI");
    return JSON.parse(jsonMatch[0]);
};

module.exports.Aiquestions = async (req, res) => {
    try {
        const { topic, noques, apiKey } = req.body;
        const key = apiKey?.trim() || process.env.GEMINI_API_KEY;

        if (!key) {
            return res.status(500).json({ error: "Missing API Key in .env or custom request body." });
        }

        const genAI = new GoogleGenerativeAI(key);

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            generationConfig: { responseMimeType: "application/json" }
        }, { apiVersion: "v1beta" });

        const prompt = `Generate a quiz about "${topic}". \n    Return ONLY a JSON array of "${noques}" objects. Each object must have "question", "options" (array of 4 strings), and "correctAnswer" (index 0-3).`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        res.json(parseAiJsonArray(text));

    } catch (error) {
        console.error("AI Error:", error);
        const message = /expired|invalid api key|unauthorized|auth|401|403/i.test(error.message)
            ? "AI API key invalid or expired. Please enter a valid API key."
            : error.message || "Internal Server Error";
        const status = /unauthorized|401/i.test(error.message) ? 401 : 500;
        res.status(status).json({ error: message, details: error.message });
    }
};

module.exports.AiquestionsFromFile = async (req, res) => {
    try {
        const noques = Number(req.body?.noques || 5);
        const file = req.file;
        const apiKey = req.body?.apiKey;
        const key = apiKey?.trim() || process.env.GEMINI_API_KEY;

        if (!file) {
            return res.status(400).json({ error: "File is required" });
        }

        if (!key) {
            return res.status(500).json({ error: "Missing API Key in .env or custom request body." });
        }

        const genAI = new GoogleGenerativeAI(key);
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            generationConfig: { responseMimeType: "application/json" }
        }, { apiVersion: "v1beta" });

        const prompt = `Generate a quiz only from the uploaded content.
Return ONLY a JSON array of "${noques}" objects.
Each object must have "question", "options" (array of 4 strings), and "correctAnswer" (index 0-3).`;

        let result;
        if (file.mimetype === "application/pdf") {
            const parsed = await pdfParse(file.buffer);
            const textContent = (parsed.text || "").slice(0, 20000);
            result = await model.generateContent(`${prompt}\n\nUploaded PDF text:\n${textContent}`);
        } else if (file.mimetype.startsWith("image/")) {
            result = await model.generateContent([
                { text: prompt },
                {
                    inlineData: {
                        data: file.buffer.toString("base64"),
                        mimeType: file.mimetype
                    }
                }
            ]);
        } else {
            return res.status(400).json({ error: "Only image or PDF files are supported" });
        }

        const text = result.response.text();
        return res.json(parseAiJsonArray(text));
    } catch (error) {
        console.error("AI File Error:", error);
        return res.status(500).json({
            error: "Internal Server Error",
            details: error.message
        });
    }
};

// Basic mock-test topic generator so the route is always valid.
module.exports.generateMockTestTopic = async (req, res) => {
    try {
        const { userTopic } = req.body || {};
        const presets = [
            "JavaScript fundamentals",
            "React performance optimization",
            "Node.js API design",
            "System design basics",
            "Database indexing and queries",
        ];

        const topic =
            typeof userTopic === "string" && userTopic.trim()
                ? userTopic.trim()
                : presets[Math.floor(Math.random() * presets.length)];

        return res.status(200).json({
            topic,
            source: userTopic ? "user" : "random",
        });
    } catch (error) {
        return res.status(500).json({
            error: "Failed to generate mock test topic",
            details: error.message,
        });
    }
};

// Placeholder evaluator; returns structured response expected by frontend consumers.
module.exports.evaluateMockTest = async (req, res) => {
    try {
        const { question, answer } = req.body || {};

        if (!question || !answer) {
            return res.status(400).json({
                error: "question and answer are required",
            });
        }

        return res.status(200).json({
            score: null,
            verdict: "pending",
            feedback:
                "Mock test evaluation is available but detailed scoring rules are not configured yet.",
        });
    } catch (error) {
        return res.status(500).json({
            error: "Failed to evaluate mock test",
            details: error.message,
        });
    }
};


