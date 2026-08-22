import React, { useState } from "react";
import Regsiterform from "../components/registerform";
import Loginform from "../components/loginform";
import Logo from "../components/Logo";
import Type from "../components/type";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const [flag, setflag] = useState(false);
  const [showPop, setShowPop] = useState(false);

  const navigate=useNavigate()

  return (
    <div className="min-h-screen bg-black w-full max-w-7xl  text-white ">
      <div className="flex items-center justify-between px-2">
        <button onClick={()=>navigate("/")} className="    bg-white mt-5 rounded-2xl px-8  active:scale-99 text-black f3">Back</button>
       <button onClick={() => setShowPop(prev=>!prev)} className="  lg:hidden bg-white mt-5 rounded-2xl px-8 active:scale-99 text-black f3">Login</button>
       
      </div>
      
       <div className="w-full max-w-7xl mx-auto px-6 lg:px-14">

      <section className="w-full  flex flex-col items-start justify-between lg:flex-row gap-8 lg:gap-12   rounded-3xl sm:px-6  lg:px-12  py-5 shadow-2xl">

         <div className=" w-full lg:w-2/5  " >
          <Logo />

        <h1 className="mt-6 text-3xl md:text-4xl font-black f3">
          Play. Create. Compete.
        </h1>
        <p className="mt-3  text-white/75 f3">
          <Type/>
          </p>

        <div className="mt-6 space-y-3 f3">
          <p className="flex items-center gap-3"><i className="ri-sparkling-2-fill text-yellow-400"></i> AI Quiz Generator</p>
          <p className="flex items-center gap-3"><i className="ri-timer-flash-line text-green-400"></i> Timed + Practice Modes</p>
          <p className="flex items-center gap-3"><i className="ri-bar-chart-grouped-line text-blue-400"></i> Dashboard + Leaderboard</p>
        </div>

        <p className="mt-8 text-sm text-white/60 f3">
          Join now and test your skills daily.
        </p>
        </div>

        
      
<div className="hidden  lg:block max-w-md sm:max-w-lg">
        {flag ? <Regsiterform setflag={setflag} /> : <Loginform setflag={setflag} />}
      </div>

      

      </section>
      </div>

      
      {showPop && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm lg:hidden flex items-start justify-center p-4 pt-20 overflow-y-auto">
          <div className="w-full max-w-md">
            <div className="mb-3 flex justify-end">
              <button
                type="button"
                onClick={() => setShowPop(false)}
                className="bg-white text-black rounded-xl px-4 py-1"
              >
                Close
              </button>
            </div>
            {flag ? <Regsiterform setflag={setflag} /> : <Loginform setflag={setflag} />}
          </div>
        </div>
      )}
    </div>
  );
};

export default Auth;
