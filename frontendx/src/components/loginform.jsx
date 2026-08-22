import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { loginUser,forgotpass } from "../api/authapi";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { adduser } from "../feature/auth.slice";
import Logo from "./Logo";
import {toast} from "react-toastify";
import Loader  from "./loader";




const LoginForm = ({ setflag }) => {
  const { user } = useSelector((state) => state.auth);
  const [showForgot, setShowForgot] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [Esent, setEsent] = useState(false)

  const navigate = useNavigate();
  const dispatch = useDispatch()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {

      username: "",

      password: "",
    },
  });

  const onSubmit = async (data) => {
    if (loading) return;
    setLoading(true);
    try {
      let loggedinUser = await loginUser(data);

      console.log(loggedinUser);


      if (loggedinUser) {
        dispatch(adduser(loggedinUser))
        navigate("/");
      }
      reset();


    } catch (error) {
      console.log("error in login form", error);
    } finally {
      setLoading(false);
    }
  };

  const forget=async()=>{
 
    if(!email){
      toast.error("Please enter your email");
      return;
    }

      if (loading) return;

        setLoading(true);


    try {
      let forgot =await forgotpass(email)
       console.log(forgot);
       setEsent(true);
      
    } catch (error) {
        console.log("error in forgot password", error);
        toast.error(error?.response?.data?.msg || "Unable to send the reset link. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 p-8 md:p-12  rounded-[30px] shadow-2xl w-full  max-w-md bg-white/10 backdrop-blur-xl border border-white/20 animate-in fade-in zoom-in duration-500"
    >
      <div className="text-center  overflow-hidden mb-8 relative">
        <h2 className="text-3xl md:text-4xl f3 font-black text-white mb-2">
          Login
        </h2>

        <p className="text-white/60 text-sm font-medium">
          Welcome back! Please enter your details.
        </p>
      </div>
 
      <div className="space-y-4 ">
        <div>
          <input
            type="text"
            placeholder="Username"
            {...register("username", { required: "Username is required" })}
            className={`w-full px-4 sm:px-5 py-3 sm:py-4  rounded-2xl bg-white/5 border text-sm sm:text-base placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all ${
              errors.username ? "border-red-400" : "border-white/10"
            }`}
          />
          {errors.username && (
            <span className="text-xs text-red-300 ml-2 mt-1 block font-medium">
              {errors.username.message}
            </span>
          )}
        </div>

        <div>
          <input
            type="password"
            placeholder="Password"
            {...register("password", { required: "Password is required" })}
            className={`w-full  rounded-2xl bg-white/5 border px-4 sm:px-5 py-3 sm:py-4 text-sm sm:text-base placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all ${
              errors.password ? "border-red-400" : "border-white/10"
            }`}
          />
          {errors.password && (
            <span className="text-xs text-red-300 ml-2 mt-1 block font-medium">
              {errors.password.message}
            </span>
          )}
          <button
            type="button"
            onClick={() => setShowForgot(true)}
            className="p-2 text-sm font-bold hover:text-yellow-400"
          >
            Forgot Password?
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-white text-purple-600 rounded-2xl font-black text-lg shadow-xl hover:shadow-2xl active:scale-95 transition-all mt-4 uppercase tracking-widest"
      >
        {loading ? "Signing In..." : "Sign In"}
      </button>

      <div className="text-center mt-6 text-sm text-white/70">
        Don&apos;t have an account?{" "}
        <button
          type="button"
          className="text-white hover:text-yellow-400 font-bold underline decoration-white/20 underline-offset-4 transition-colors"
          onClick={() => setflag((prev) => !prev)}
        >
          Register for free
        </button>
      </div>

      {showForgot && (
        <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/85 p-4 backdrop-blur-md">
          <div className="w-full max-w-md space-y-5 rounded-3xl border border-white/10 bg-[#11151c]/95 p-6 shadow-2xl sm:p-8">
            <h2 className="mb-2 text-3xl font-black text-white md:text-4xl f3">
              Reset Password
            </h2>

            {loading && <Loader />}

            {!Esent ? (
              
              <div className="flex w-full flex-col gap-8">
                <p className="text-sm font-medium text-white/60">
                  Please enter your registered email
                </p>
 
                <div className="flex w-full items-center gap-3">
                  <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 transition-all focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />

                
                  <button
                    aria-label="Send password reset link"
                    className="shrink-0 rounded-xl bg-yellow-400 p-3 font-bold text-black transition hover:bg-yellow-300"
                    type="button"
                    onClick={forget}
                  >
                   <i className="ri-send-plane-fill text-lg"></i>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex w-full flex-col items-center justify-center gap-8"> 
                <p className="mt-4 text-center text-sm font-medium text-green-400">
                  A password reset link has been sent to <span className="font-semibold">{email || "your email"}</span>. Check your inbox and follow the instructions.
                </p>
                <button
                  onClick={() => setEsent(false)}
                  className="font-bold text-white underline decoration-white/20 underline-offset-4 transition-colors hover:text-yellow-400"
                >
                  Try Another Email
                </button>
               </div> 




            )}

            
            
          </div>

          <button
              type="button"
              onClick={() => setShowForgot(false)}
              className="rounded-xl border border-white/15 bg-white/10 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              back
            </button>
        </div>
      )}

       
     
    </form>
  );
};

export default LoginForm;
