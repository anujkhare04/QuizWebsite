import React, { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Testsetup from "./testsetup";
import { getAllCategories } from "../api/createApi";
import Login from "../components/loginonly";
import { useSelector } from "react-redux";



const quizchose = ({ setQuizData }) => {

  const [formdata, setformdata] = useState('')
  const [categories, setCategories] = useState([]);
  const [showAuthGate, setShowAuthGate] = useState(false);
  const navigate=useNavigate();
  const { user } = useSelector((state) => state.auth);
  
 

  const { register, watch, handleSubmit } = useForm({
    defaultValues: {
      quizSource: "all",
      type: "",
      questionLimit: 5,
      timeLimit: 1,

    },
  });

  



  const watchType = watch("type");
  const quizSource = watch("quizSource");
  const selectedCategory = watch("category");



  const onsubmit = (data) => {



    if (data.type !== "numberOfQuestions") {
      delete data.questionLimit;
    }

    setformdata(data);


    const finalData = { ...data, category: data.category };

    setQuizData(finalData);






  };

  useEffect(() => {

    console.log("formData updated:", formdata);
  }, [formdata]);

  useEffect(() => {

    const fetchCategories = async () => {
      try {
        const data = await getAllCategories(quizSource)


        const mappedCategories = data.map((cat) => ({
          name: cat,

        }));

        setCategories(mappedCategories);

      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchCategories();
  }, [quizSource]);

  useEffect(() => {
  if (!user) {
    setShowAuthGate(true);
  }
}, [user]);

 

  return (
         
    
     

    <div className="relative min-h-screen bg-black px-3 pt-24 pb-12 sm:px-5 lg:px-8">
     
     
  
    <div className=" bg-white absolute top-10 left-120  z-200">
        
      </div>
     
   
  {showAuthGate && (
  <div className="fixed inset-0 z-200 flex items-center justify-center p-4 overflow-y-auto">
    
    
    
    <div className="absolute inset-0  bg-black/50 backdrop-blur-sm"></div>

     
      
    
    <button
      type="button"
       onClick={()=>setShowAuthGate(false)}
      className="fixed top-4 right-4 text-white text-4xl z-210"
    >
      <i className="ri-close-circle-line"></i>
    </button>

    <div className="relative z-10 w-full flex justify-center">

      <Login onContinueGuest={() => setShowAuthGate(false)} />
    </div>

  </div>
  )}

     
     
        
      <div className="fixed left-0 top-0 z-100 flex min-h-20 w-full items-center justify-between gap-3 border-b border-white/10 bg-black/95 px-3 py-3 backdrop-blur-md sm:px-5">
         <button onClick={()=>navigate("/")} className="shrink-0 rounded-2xl bg-white px-4 py-2 text-sm text-black active:scale-95 f3">Back</button>
       
        <h1 className="m-0 min-w-0 flex-1 bg-black px-1 py-1 text-right text-2xl font-bold leading-tight text-white sm:text-3xl md:text-6xl f3">
          Choose Your <span className="font-light">Challenge</span>
        </h1>
      </div>

     

      <div className="mx-auto mt-4 w-full max-w-7xl md:px-3">
        
         
        <form onSubmit={handleSubmit(onsubmit)} className="space-y-12">
          <div className="rounded-[10px] border border-white/20 bg-white/10 p-4 shadow-2xl backdrop-blur-md sm:p-6 md:p-10">
            <h2 className="f3 text-xl md:text-2xl text-white mb-8 ml-2 flex items-center gap-3">
              <i className="ri-layout-grid-fill text-yellow-400"></i>
              Select Category
            </h2>

            <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className={`flex cursor-pointer items-center gap-3 rounded-2xl border-2 p-4 transition-all ${quizSource === "all" ? "border-cyan-300 bg-cyan-300/15" : "border-white/10 bg-white/5 hover:bg-white/10"}`}>
                <input type="radio" value="all" {...register("quizSource")} className="h-5 w-5 accent-cyan-300" />
                <span className="f3">
                  <strong className="block text-white">Available Quizzes</strong>
                  <small className="text-white/60">Choose from the community</small>
                </span>
              </label>
              <label className={`flex cursor-pointer items-center gap-3 rounded-2xl border-2 p-4 transition-all ${quizSource === "mine" ? "border-orange-300 bg-orange-300/15" : "border-white/10 bg-white/5 hover:bg-white/10"}`}>
                <input type="radio" value="mine" {...register("quizSource")} className="h-5 w-5 accent-orange-300" />
                <span className="f3">
                  <strong className="block text-white">My Quizzes</strong>
                  <small className="text-white/60">Play quizzes you created</small>
                </span>
              </label>
            </div>

            <div className="grid max-h-[35vh] grid-cols-1 gap-4 overflow-y-auto p-1 scroll-y sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
              {categories.map((cat) => (
                <label
                  key={cat.name}
                  className={`group relative rounded-3xl p-5 min-h-0 shadow-xl cursor-pointer overflow-hidden transition-all duration-300 border-2
                    ${selectedCategory === cat.name
                      ? "bg-white border-yellow-400 scale-105"
                      : "bg-white/5 border-white/10 hover:bg-white/10"}`}
                >
                  <input
                    type="radio"
                    value={cat.name}
                    {...register("category", { required: true })}
                    className="absolute opacity-0"
                  />
                  <div className="relative z-10">
                    <h3 className={`text-xl md:text-2xl font-black mb-3 transition-colors ${selectedCategory === cat.name ? "text-purple-600" : "text-white"}`}>
                      {cat.name}
                    </h3>
                    <p className={`text-sm font-medium leading-relaxed opacity-70 ${selectedCategory === cat.name ? "text-purple-800" : "text-white/80"}`}>
                      Test your expertise in {cat.name} and climb the leaderboard!
                    </p>
                  </div>
                  {selectedCategory === cat.name && (
                    <div className="absolute top-4 right-4 text-yellow-500 animate-bounce">
                      <i className="ri-checkbox-circle-fill text-3xl"></i>
                    </div>
                  )}
                </label>
              ))}
            </div>
          </div>

          

          <div className="mx-auto w-full rounded-[20px] border border-white/20 bg-white/10 p-4 shadow-2xl backdrop-blur-md sm:p-6 md:p-12">
            <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="mb-0 flex items-center gap-3 text-xl text-white md:text-2xl f3">
              <i className="ri-settings-4-fill text-blue-400 font-normal"></i>
              Quiz Settings
            </h2>
            
              <button
                type="submit"
                className="w-full rounded-sm border-2 bg-white px-5 py-3 text-sm font-black uppercase tracking-wider text-purple-600 shadow-xl transition-all hover:bg-black hover:text-white hover:shadow-2xl active:scale-95 sm:w-auto sm:py-4 f3"
              >
                Start Quiz
              </button>
            </div>

            <div className="space-y-8">
              <div>
                <label className="block text-white/70 text-sm font-bold uppercase tracking-widest mb-4 ml-1">
                  Game Mode
                </label>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {["timed", "Stop on Incorrect", "numberOfQuestions"].map((mode) => (
                    <label key={mode} className={`flex min-w-0 items-center gap-3 rounded-xl border-2 p-4 transition-all cursor-pointer sm:p-5 ${watchType === mode ? "bg-white border-yellow-400" : "bg-white/5 border-white/10 hover:bg-white/10"}`}>
                      <input
                        type="radio"
                        value={mode}
                        {...register("type", { required: true })}
                        className="w-5 h-5 accent-purple-500"
                      />
                      <span className={` f3   capitalize ${watchType === mode ? "text-purple-600" : "text-white"}`}>
                        {mode === "timed" ? <i class="  flex item-center justify-evenly gap-2 ri-timer-flash-line"><span>Timed Trial</span></i> : mode === "Stop on Incorrect" ?<i class=" flex item-center justify-evenly gap-2 ri-skull-line"><span>Sudden Death</span></i> :<i class=" flex item-center justify-evenly gap-2 ri-book-open-line "><span>Practice Mode</span></i>}
                      </span>
                    </label>
                  ))}
                </div>
              </div>  

              {watchType === "numberOfQuestions" && (
                <div className="animate-in slide-in-from-top-4 duration-300">
                  <label className="block text-white/70 text-sm font-bold uppercase tracking-widest mb-4 ml-1">Total Questions</label>
                  <input
                    type="number"
                    min={5}
                    max={30}
                    {...register("questionLimit", { required: true, min: 5, max: 30 })}
                    className="w-full bg-white/5 border border-white/10 text-white px-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all font-bold text-xl"
                    placeholder="Enter 5-30"
                  />
                </div>
              )}

              {watchType === "timed" && (
                <div className="animate-in slide-in-from-top-4 duration-300">
                  <label className="block text-white/70 text-sm font-bold uppercase tracking-widest mb-4 ml-1">Duration (Minutes)</label>
                  <input
                    type="number"
                    min={1}
                    max={60}
                    {...register("timeLimit", { required: true, min: 1, max: 60 })}
                    className="w-full bg-white/5 border border-white/10 text-white px-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all font-bold text-xl"
                    placeholder="Enter minutes"
                  />
                </div>
              )}

            </div>
          </div>
        </form>
      </div>
      
    </div>
  );
};

export default quizchose;
