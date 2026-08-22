import axiosInstance from "../axios/axiosinstance";

export const SavedStats = async (data) => {
  try {
    const res = await axiosInstance.post("/quiz/saved", data);
    return res.data;
  } catch (error) {
    console.log("Error in Saving Stats", error);
  }
};

export const getsaved = async (userId) => {
  try {
    const res = await axiosInstance.get(`/quiz/getsaved/${userId}`);
    return res.data;
  } catch (error) {
    console.log("error while fetch score");
  }
};

export const getperformance = async (userId, range) => {
  try {
    const res = await axiosInstance.get(`/quiz/performance/${userId}?range=${range}`);
    return res.data;
  } catch (error) {
    console.log("error while fetch Performance");
  }
};

export const getLeaderboard = async (range = "global", limit = 50) => {
  try {
    const res = await axiosInstance.get(`/quiz/leaderboard?range=${range}&limit=${limit}`);
    return res?.data;
  } catch (error) {
    console.log("error while fetch leaderboard");
    throw error;
  }
};
