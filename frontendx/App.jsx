import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { adduser, removeuser } from "./src/feature/auth.slice";
import Home from "./src/pages/home";
import CreateQuiz from "./src/pages/creatquiz";
import Login from "./src/pages/login";
import MockTest from "./src/pages/MockTest";
import { Route, Routes } from "react-router-dom";
import QuizParent from "./src/pages/quizparents";
import Testwindow from "./src/pages/testwindow";
import Profile from "./src/components/profile";
import AuthLayout from "./src/components/AuthLayout";
import { axiosInstance } from "./src/axios/axiosinstance";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dashboard from "./src/pages/Dashboard";
import ResetPassword from "./src/pages/resetpassword";
import { Pcontext } from "./src/context/context";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        dispatch(removeuser());
        return;
      }
      try {
        const res = await axiosInstance.get("/auth/profile");
        dispatch(adduser(res.data));
      } catch (err) {
        console.log(err);
        dispatch(removeuser());
      }
    };
    checkAuth();
  }, [dispatch]);

  return (
    <div className="min-h-screen">
      <ToastContainer position="top-right" autoClose={3500} theme="dark" closeOnClick newestOnTop pauseOnHover draggable className="right-4! top-4! w-[calc(100%-2rem)]! sm:w-[380px]!" toastClassName="!min-h-0 !rounded-2xl !border !border-white/[0.08] !bg-gradient-to-br !from-[#1c1f27]/95 !to-[#111318]/95 !px-4 !py-3 !text-white !shadow-[0_12px_40px_rgba(0,0,0,0.45)] !backdrop-blur-2xl" bodyClassName="!m-0 !p-0" progressClassName="!h-[3px] !rounded-full !bg-gradient-to-r !from-amber-300 !via-amber-400 !to-orange-400" />
      <Pcontext>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mocktest" element={<MockTest />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/reset/:token" element={<ResetPassword />} />
          <Route path="/categories/:cat" element={<Testwindow />} />
          <Route path="/qchose" element={<QuizParent />} />
          <Route element={<AuthLayout />}>
            <Route path="/create-quiz" element={<CreateQuiz />} />
          </Route>
        </Routes>
      </Pcontext>
    </div>
  );
};
export default App;
