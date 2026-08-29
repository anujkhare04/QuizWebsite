const ACTIVE_QUIZ_KEY = "activeQuizSession";

const sameCategory = (a, b) =>
  decodeURIComponent(String(a || "")).toLowerCase() ===
  decodeURIComponent(String(b || "")).toLowerCase();

export const saveActiveQuiz = (session) => {
  try {
    sessionStorage.setItem(ACTIVE_QUIZ_KEY, JSON.stringify(session));
  } catch (error) {
    console.error("Failed to persist quiz session:", error);
  }
};

export const loadActiveQuiz = (cat) => {
  try {
    const parsed = JSON.parse(sessionStorage.getItem(ACTIVE_QUIZ_KEY) || "null");
    if (!parsed?.quizData) return null;
    if (cat && !sameCategory(parsed.cat, cat)) return null;
    return parsed;
  } catch (error) {
    console.error("Failed to restore quiz session:", error);
    return null;
  }
};

export const clearActiveQuiz = () => {
  sessionStorage.removeItem(ACTIVE_QUIZ_KEY);
};
