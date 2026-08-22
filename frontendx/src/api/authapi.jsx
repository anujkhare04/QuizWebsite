import axiosInstance from "../axios/axiosinstance";

export const registerUser = async (data) => {
  try {
    const res = await axiosInstance.post("/auth/register", data);
    if (res.data?.token) {
      localStorage.setItem("token", res.data.token);
    }
    return res.data;
  } catch (error) {
    console.log("error in register user", error);
    throw error;
  }
};

export const loginUser = async (data) => {
  try {
    const res = await axiosInstance.post("/auth/login", data);
    if (res.data?.token) {
      localStorage.setItem("token", res.data.token);
    }
    return res.data?.user || res.data;
  } catch (error) {
    console.log("error in login user", error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await axiosInstance.post("/auth/logout");
  } catch (error) {
    console.log("error in logout user", error);
  } finally {
    localStorage.removeItem("token");
  }
};

export const forgotpass = async (email) => {
  try {
    const res = await axiosInstance.post("/auth/forgot", { email });
    return res.data;
  } catch (error) {
    console.log("error in forgot password", error);
    throw error;
  }
};

export const updateProfileApi = async (formData) => {
  try {
    const res = await axiosInstance.put("/auth/profile", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data?.user || res.data;
  } catch (error) {
    console.log("error in update profile", error);
    throw error;
  }
};

export const getProfile = async () => {
  try {
    const res = await axiosInstance.get("/auth/profile");
    return res.data?.user || res.data;
  } catch (error) {
    console.log("error in get profile", error);
    throw error;
  }
};
