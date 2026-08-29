import axiosInstance from "../axios/axiosinstance";

export const Createquiz = async (data) => {
  try {
    const res = await axiosInstance.post("/quiz/create", data);
    return res.data;
  } catch (error) {
    console.log("error in creating quiz", error);
    throw error;
  }
};

export const getcategory = async (cat, scope = "all") => {
  const encodedCat = encodeURIComponent(cat);
  const res = await axiosInstance.get(`/quiz/categories/${encodedCat}?scope=${scope}`);
  return res.data;
};

export const getAllCategories = async (scope = "all") => {
  const res = await axiosInstance.get(`/quiz/categories?scope=${scope}`);
  return res.data;
};

export const getRandomQuiz = async () => {
  const res = await axiosInstance.get("/quiz/random");
  return res.data;
};

export const RANDOM_QUIZ_MODES = ["numberOfQuestions", "timed", "Stop on Incorrect"];

export const toRandomQuizPlayState = (quiz, mode) => {
  if (!quiz?.questions?.length) return null;

  const type =
    mode && RANDOM_QUIZ_MODES.includes(mode)
      ? mode
      : RANDOM_QUIZ_MODES[Math.floor(Math.random() * RANDOM_QUIZ_MODES.length)];

  const quizSettings = {
    category: quiz.category,
    type,
    quizId: quiz._id,
    questions: quiz.questions,
    quizSource: "random",
  };

  if (type === "numberOfQuestions") {
    const max = quiz.questions.length;
    const min = Math.min(5, max);
    quizSettings.questionLimit = Math.floor(Math.random() * (max - min + 1)) + min;
  } else if (type === "timed") {
    quizSettings.timeLimit = Math.floor(Math.random() * 5) + 1;
  }

  return quizSettings;
};

export const getMyQuizzes = async () => {
  const res = await axiosInstance.get("/quiz/mine");
  return res.data;
};

export const Aiques = async (data) => {
  const res = await axiosInstance.post("/quiz/Aiques", data);
  return res.data;
};

export const AiquesFromFile = async (formData) => {
  const res = await axiosInstance.post("/quiz/Aiques/file", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const generateMockTestTopic = async (userTopic) => {
  const res = await axiosInstance.post("/quiz/mock-test/topic", { userTopic });
  return res.data;
};

export const evaluateMockTest = async (data) => {
  const res = await axiosInstance.post("/quiz/mock-test/evaluate", data);
  return res.data;
};
