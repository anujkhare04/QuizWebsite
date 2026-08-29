import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getcategory, getRandomQuiz, toRandomQuizPlayState } from "../api/createApi";
// import useQuizSecurity from "../components/hooks";
import { toast } from "react-toastify";
import { SavedStats } from "../api/analysis";
import { useSelector } from "react-redux";
import { getsaved } from "../api/analysis";
import { clearActiveQuiz, loadActiveQuiz, saveActiveQuiz } from "../utils/quizSession";




const Testwindow = ({ quizData }) => {

  // console.log(quizData);
   
   

  const location = useLocation();
  const navigate = useNavigate();
  const { cat } = useParams();
  const cachedSession = loadActiveQuiz(cat);
  const saved = location.state?.quizData || cachedSession?.quizData || null;
  const restoredProgress =
    !location.state?.quizData && cachedSession?.progress?.res?.length
      ? cachedSession.progress
      : null;
  const skipReloadReset = Boolean(restoredProgress);
  const {user}= useSelector((state) => state.auth);
  const currentUser = user?.user ?? user;
 const [quizId, setQuizId] = useState(restoredProgress?.quizId || null);
 
  
//  console.log("Full Redux auth state:", state.auth);
 
  //  console.log("user:",user);

  //  console.log(" quizId:",quizId);
   
  if (!saved) {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4">
      <p>Quiz session expired. Reload cleared the quiz data.</p>
      <button onClick={() => navigate("/")}>Go Home</button>
    </div>
  );
}
  const timeLimit = Number(saved.timeLimit * 60);


  const [status, setstatus] = useState(restoredProgress?.status || "idle");
  const [timeLeft, setTimeLeft] = useState(restoredProgress?.timeLeft ?? timeLimit);
  const [answered, setAnswered] = useState(restoredProgress?.answered ?? false);
  const [res, setRes] = useState(restoredProgress?.res ?? []);
  const [curindex, setcurindex] = useState(restoredProgress?.curindex ?? 0);
  const [score, setscore] = useState(restoredProgress?.score ?? 0);
  const [answers, setAnswers] = useState(restoredProgress?.answers ?? {});
  const [QuizTimeTaken, setQuizTimeTaken] = useState(restoredProgress?.QuizTimeTaken ?? 0);
  const [questionTimes, setQuestionTimes] = useState(restoredProgress?.questionTimes ?? {});
  const [Panalysis, setPanalysis] = useState(restoredProgress?.Panalysis ?? []);
  const [showpopup, setshowpopup] = useState(false)


  const calculateScore = (currentAnswers = answers) => {
    if (!res || res.length === 0) return 0;
    let total = 0;

    Object.entries(currentAnswers).forEach(([qIndex, optionIndex]) => {
      const qIdx = parseInt(qIndex);
      const question = res[qIdx];
      if (!question) return;

      const selectedOptionText = String(question.options[optionIndex] || "").trim().toLowerCase();
      const dbAnswer = String(question.correctAnswer || "").trim().toLowerCase();


      const isIndexMatch = Number(dbAnswer) === (Number(optionIndex));


      const isTextMatch = dbAnswer === selectedOptionText;

      if (isIndexMatch || isTextMatch) {
        total++;
      } else {
        total--;
      }
    });

    return total;
  };


  const handleRandomQuiz = async () => {
    try {
      const quiz = await getRandomQuiz();
      const quizSettings = toRandomQuizPlayState(quiz);
      if (!quizSettings) {
        alert("No quizzes available!");
        return;
      }
      navigate(`/categories/${quiz.category}`, { state: { quizData: quizSettings } });
    } catch (error) {
      console.error("Failed to start random quiz:", error);
      alert(error?.response?.data?.message || "Failed to start random quiz");
    }
  };

  useEffect(() => {
    setAnswered(false);
  }, [curindex]);


  useEffect(() => {
    if (skipReloadReset) return;
    setstatus("idle");
    setcurindex(0);
    setscore(0);
    setAnswers({});
    setRes([]);
    setQuizTimeTaken(0);
    setQuestionTimes({});
    setPanalysis([]);
    if (saved?.type === "timed") {
      setTimeLeft(Number(saved.timeLimit * 60));
    }
  }, [location.pathname, cat]);


  useEffect(() => {
    if (res.length > 0) {
      setscore(calculateScore(answers));
    }
  }, [answers, res]);


  const [showExitPopup, setShowExitPopup] = useState(false);


  useEffect(() => {
    const handleBackButton = (e) => {
      if (status === "playing") {
        e.preventDefault();
        setShowExitPopup(true);
        window.history.pushState(null, "", window.location.href);
      }
    };

    if (status === "playing") {
      window.history.pushState(null, "", window.location.href);
      window.addEventListener("popstate", handleBackButton);
    }

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, [status]);

  const handleEndTest = () => {
    setscore(calculateScore(answers));
    setShowExitPopup(false);
    setstatus("score");
  };

  const handleContinueTest = () => {
    setShowExitPopup(false);
  };



  useEffect(() => {
    if (saved?.type === "timed" && status === "playing") {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setstatus("finished");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [saved?.type, status]);


  useEffect(() => {
    let timer;
    if (status === "playing") {
      timer = setInterval(() => {
        setQuizTimeTaken((prev) => prev + 1);
        setQuestionTimes((prev) => ({
          ...prev,
          [curindex]: (prev[curindex] || 0) + 1
        }));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [status, curindex]);

  useEffect(() => {
    if (!saved) return;
    if (skipReloadReset) return;
    getapi();
  }, [cat]);

  useEffect(() => {
    if (!saved || !cat) return;
    saveActiveQuiz({
      cat,
      quizData: saved,
      progress: {
        status,
        timeLeft,
        answered,
        quizId,
        res,
        curindex,
        score,
        answers,
        QuizTimeTaken,
        questionTimes,
        Panalysis,
      },
    });
  }, [
    saved,
    cat,
    status,
    timeLeft,
    answered,
    quizId,
    res,
    curindex,
    score,
    answers,
    QuizTimeTaken,
    questionTimes,
    Panalysis,
  ]);



  const shuffle = (res) => {
    const arr = [...res];

    for (let i = res.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    return arr;
  };

  // console.log(saved.questionLimit);
  // console.log(curindex);

  const getapi = async () => {
  try {
    if (saved.quizSource === "random" && saved.questions?.length) {
      const shuffled = shuffle(saved.questions);
      setQuizId(saved.quizId);
      if (saved.type === "numberOfQuestions") {
        const limit = Math.min(
          Number(saved.questionLimit) || shuffled.length,
          shuffled.length
        );
        setRes(shuffled.slice(0, limit));
      } else {
        setRes(shuffled);
      }
      return;
    }

    const data = await getcategory(cat, saved.quizSource || "all");
    const quiz = saved.quizId
      ? data.find((item) => String(item._id) === String(saved.quizId)) || data[0]
      : data[0];

    if (!quiz || !quiz.questions) {
      toast.error("No questions found for this category");
      navigate("/");
      return;
    }

    const shuffled = shuffle(quiz.questions);

    setQuizId(quiz._id);

    if (saved.type === "numberOfQuestions") {
      const limit = Math.min(
        Number(saved.questionLimit),
        shuffled.length
      );
      setRes(shuffled.slice(0, limit));
    } else {
     
      setRes(shuffled);
    }

  } catch (error) {
    console.log("Error in getting category", error);
  }
};


  useEffect(() => {
    if (status === "idle" && res.length > 0) {
      setstatus("playing");
    }
  }, [status, res]);


  const correct = (i) => {



    const dbAnswer = res[curindex]?.correctAnswer;
    const selectedText = res[curindex]?.options[i];

    const isCorrect = (Number(dbAnswer) === (i)) ||
      (String(dbAnswer).toLowerCase() === String(selectedText).toLowerCase());

    setPanalysis((prev) => {
      const questionId = res[curindex]._id;

      const Existing = prev.findIndex((item) => item.questionId === questionId);

      const updated = {
        questionId,
        option: i,
        isCorrect
      };


      if (Existing !== -1) {
        const copy = [...prev]
        copy[Existing] = updated;
        return copy;
      }

      return [...prev, updated]

    });

    const newAnswers = {
      ...answers,
      [curindex]: i
    };
    setAnswers(newAnswers);

    if (!isCorrect) {
      setscore(calculateScore(newAnswers));
      setstatus("lost");
      return;
    }


    const limit = saved.questionLimit ? Math.min(Number(saved.questionLimit), res.length) : res.length;
    if (curindex + 1 >= limit) {
      setstatus("finished");
      return;
    }

    if (isCorrect) {

      setTimeout(() => {
        setcurindex(prev => prev + 1);
      }, 200);
    }
  };


  const nxtback = (step) => {
    setcurindex(prev => {
      const nextIndex = prev + step;

      if (nextIndex < 0) return 0;


      const limit = saved.questionLimit ? Math.min(Number(saved.questionLimit), res.length) : res.length;

      if (nextIndex >= limit) {
        setstatus("finished");
        return prev;
      }

      return nextIndex;
    });
  };



  

  useEffect(() => {
  if (res?.length && !skipReloadReset) {
    setPanalysis(
      res.map(q => ({
        questionId: q._id,
        option: null,
        isCorrect: false,
         
      }))
    );
  }
}, [res, skipReloadReset]);
 





  const handleAnswer = (optionIndex) => {

    const dbAnswer = res[curindex]?.correctAnswer;
    const selectedText = res[curindex]?.options[optionIndex];


    const isCorrect = (Number(dbAnswer) === (optionIndex)) ||
      (String(dbAnswer).toLowerCase() === String(selectedText).toLowerCase());

      const questionId = res[curindex]._id;



   setPanalysis(prev =>
    prev.map(item =>
      item.questionId === questionId
        ? {
            ...item,
            option: optionIndex,
            isCorrect,
            skipped: false,
          
          }
        : item
    )
  );

    setAnswers(prev => ({
      ...prev,
      [curindex]: optionIndex
    }));

  };

  useEffect(() => {
    console.log("Panalysis",Panalysis);
  }, [Panalysis]);

  


   
  


   
  const handlestats = async () => {

  

if (!currentUser?._id || !quizId) {
  toast.error("Login required");
  
  return;
}  

let finalAnalysis;

if (saved.type === "timed") {
  finalAnalysis = Panalysis.filter(q => q.option !== null);
  
} else {
  finalAnalysis = Panalysis;
} 

const attempted = finalAnalysis.filter(q => q.option !== null).length;


const stats = {
  userId: currentUser._id,
  quizId,
  mode: saved.type,
  timeTaken: QuizTimeTaken,
  attempted,
  
  answers: finalAnalysis.map(a => ({
    questionId: a.questionId,
    selectedOption: a.option !== null ? String(a.option) : null,
    isCorrect: a.isCorrect
    
  }))

};

  if (saved.type === "Stop on Incorrect") {
  stats.survivalCount = curindex; 
  stats.failedQuestionId = res[curindex]?._id || null;
}  
    
    const SATA = await SavedStats(stats);
    
          console.log(SATA);

    toast.success("Saved !!");
    console.log("Saving .......");
     setTimeout(() => {
      window.location.reload();
    }, 4000);
    console.log(currentUser._id);
      await getsaved(currentUser._id);

    toast.success("New Data refresh");
     navigate("/")
  };




  return (
<div className="min-h-screen w-full bg-black relative flex flex-col">
      

      {showExitPopup && (
        <div className="fixed inset-0 z-100 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-[30px] border border-white/20 bg-white/10 p-6 md:p-8 text-white shadow-2xl animate-in fade-in zoom-in duration-300">
           <div className="flex items-center justify-between mb-4">
             <h2 className="text-2xl md:text-3xl f3 font-black text-white tracking-tight">
              Leave Test?
             </h2>
             <button
               onClick={() => setShowExitPopup(false)}
               className="rounded-xl border border-white/20 bg-black/40 px-2 py-1 hover:bg-black/70 transition-colors"
             >
              <i className="ri-close-line text-2xl text-white"></i>
             </button>
             
           </div>
            <p className="text-white/70 mb-8 leading-relaxed">
              Your progress will be lost. Do you want to end the test or
              continue?
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleEndTest}
                className="f3 rounded-2xl border border-red-400/40 bg-red-500/90 px-6 py-3 font-bold text-white transition-all hover:bg-red-500 active:scale-95"
              >
                End Test & See Score
              </button>
              <button
                onClick={handleContinueTest}
                className="f3 rounded-2xl bg-white px-6 py-3 font-black text-purple-600 transition-all  active:scale-95"
              >
                Continue Test
              </button>
              <button
                onClick={() => {
                  setShowExitPopup(false);
                  navigate("/");
                }}
                className="f3 rounded-2xl border border-white/30 bg-transparent px-6 py-3 font-bold text-white transition-all hover:bg-white/10 active:scale-95"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      )}

      {status === "playing" && (
        <div className="sticky top-0 left-0 w-full flex flex-col md:flex-row items-center justify-between gap-4 py-4 px-4 md:px-10 bg-white/10 backdrop-blur-xl border-b border-white/20 z-50">
          <h1 className="text-xl md:text-3xl font-black text-white f3 drop-shadow-md tracking-tight">
            {saved.category} <span className="opacity-70 font-light">Quiz</span>
          </h1>

          <div className="flex items-center gap-4">
            {saved.type === "Stop on Incorrect" && (
              <div className="bg-white/20 px-4 py-2 rounded-full border border-white/30 flex items-center gap-2">
                <i className="ri-heart-fill text-red-500 animate-pulse"></i>
                <span className="text-white font-bold text-sm">
                  Sudden Death
                </span>


              </div>
            )}

            {saved.type === "numberOfQuestions" && (
              <div className="flex items-center gap-3">

                <div className="bg-white/20 px-6 py-2 rounded-full border border-white/30 flex items-center gap-2">
                  <span className="text-white/70 text-sm font-medium">
                    Progress
                  </span>
                  <span className="text-white font-black text-lg">
                    {curindex}/{saved.questionLimit}
                  </span>
                </div>
              </div>
            )}

            {saved.type === "timed" && (
              <div className="flex items-center gap-3">

                <div
                  className={`px-6 py-2 rounded-full border flex items-center gap-2 transition-colors duration-500 ${timeLeft < 10 ? "bg-red-500/40 border-red-500 animate-pulse" : "bg-white/20 border-white/30"}`}
                >
                  <span className="text-white font-black">
                    {timeLeft >= 60
                      ? `${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, "0")}`
                      : `${timeLeft}s`}
                  </span>


                </div>


                <button
                  onClick={() => {
                    setscore(calculateScore(answers));
                    setstatus("score");
                  }}
                  className="bg-white/10 hover:bg-red-500 text-white px-5 py-2 rounded-full border border-white/20 transition-all font-bold text-sm active:scale-95"
                >
                  Quit
                </button>
              </div>
            )}
          </div>
        </div>
      )}

       {showpopup &&(
            <div className="fixed inset-0 z-100 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-[30px] border border-white/20 bg-white/10 p-6 md:p-8 text-white shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="flex items-center justify-between  mb-3">
              <h2 className="text-2xl md:text-3xl f3 font-black text-white tracking-tight">
              Save Stats ?
            </h2>
            <button
              onClick={() => setshowpopup(prev=>!prev)}
              className="rounded-xl border border-white/20 bg-black/40 px-2 py-1 hover:bg-black/70 transition-colors"
            >
              <i className="ri-close-line text-2xl text-white"></i>
            </button>
            </div>
            <p className="text-white/70 mb-8 leading-relaxed">
              Your progress will be lost. Do you want to Save or
              Not?
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={handlestats}
                className="f3 rounded-2xl bg-white px-6 py-3 font-black text-purple-600 transition-all hover:bg-yellow-300 active:scale-95"
              >
                Save
              </button>
               
              <button
                onClick={() => {
                  setshowpopup(false);
                  navigate("/");
                }}
                className="f3 rounded-2xl border border-white/30 bg-transparent px-6 py-3 font-bold text-white transition-all hover:bg-white/10 active:scale-95"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
)}

      <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-10 max-w-5xl mx-auto w-full">
        {status === "playing" && (
          <div className="w-full animate-in slide-in-from-bottom-4 duration-500">
            {res[curindex] && (
              <div className="text-center mb-5 md:mb-16">
                <span className="inline-block px-4 py-1 bg-white/10 rounded-full text-white/60 text-xs font-bold uppercase tracking-widest mb-4">
                  Question {curindex + 1}
                </span>
                <h1 className="text-xl md:text-1xl font-bold text-white f3 leading-tight text-center">
                  {res[curindex].question}
                </h1>
              </div>
            )}
             
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full max-w-4xl mx-auto">


              {res[curindex]?.options?.map((item, i) => {

                const selectedOption = answers[curindex];

                return (
                  <button
                    key={i}

                    onClick={() => saved.type === "Stop on Incorrect" ? correct(i) : handleAnswer(i)}
                    className={`
                    group w-full min-h-[70px] rounded-3xl transition-all duration-300 relative
                    ${i === selectedOption
                        ? "bg-white text-purple-600 shadow-2xl scale-[1.02] ring-2 ring-white/50"
                        : "bg-white/10 text-white hover:bg-white/20"
                      }
                  `}

                  >
                    <div className="absolute inset-0 bg-white/5  transition-colors duration-300"></div>
                    <div className="relative flex items-center gap-6 w-full">
                      <span className={`w-10 h-10 md:w-8 md:h-8 rounded-2xl flex items-center justify-center font-black text-lg md:text-xl transition-colors ${i === selectedOption ? "bg-purple-600 text-white" : "bg-white/20 group-hover:bg-white/40"}`}>
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className="text-lg md:text-xl font-bold flex-1 leading-tight">
                        {item}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {status === "idle" && (
          <div className="flex flex-col items-center justify-center text-white gap-4">
            <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
            <p className="text-white/60 font-medium">Loading quiz questions...</p>
          </div>
        )}

        {saved.type !== "Stop on Incorrect" && status === "playing" && (
          <div className="flex py-10 items-center justify-between w-full max-w-4xl mx-auto gap-4">
            <button
              onClick={() => nxtback(-1)}
              className="f3 px-10 py-4 bg-white text-purple-600 font-bold rounded-full shadow-xl hover:shadow-2xl active:scale-95 transition-all duration-300 flex items-center gap-2 group hover:bg-black hover:text-white"
            >
              Back
            </button>
            <button
              onClick={() => nxtback(1)}
              className="f3 px-10 py-4  bg-white text-purple-600 font-bold rounded-full shadow-xl hover:shadow-2xl active:scale-95 transition-all duration-300 flex items-center gap-2 group hover:bg-black hover:text-white"
            >
              Next
            </button>
          </div>
        )}
      </div>

      

      {(status === "lost" || status === "finished" || status === "score") && (
        <div className="fixed inset-0  flex flex-col items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-500">
          <div
            className={`  w-full p-6 md:p-12 max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-[40px] text-center shadow-2xl relative  ${status === "lost" ? "bg-linear-to-r from-black via-red-600 to-black  " : "bg-linear-to-r from-yellow-400 via-black to-green-600"
              }`}
          >
            <div className="relative ">
              <h2 className="f2 font-black text-5xl md:text-7xl  text-white mb-20 tracking-tighter uppercase drop-shadow-2xl">
                {status === "lost"
                  ? "Game Over"
                  : status === "finished"
                    ? "Mission Complete"
                    : "Test Ended"}
              </h2>

              <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 mb-30">


                <div className="bg-white/20 backdrop-blur-md rounded-3xl  p-6 md:p-8 min-w-[140px] border border-white">
                  <span className="text-white/60 text-xs font-black uppercase tracking-widest block mb-2">
                    {saved.type == "Stop on Incorrect" ? "streak" : "score"}
                  </span>
                  <span className="text-white text-5xl md:text-6xl font-black">
                    {saved.type === "Stop on Incorrect" ? curindex : score}
                  </span>
                </div>

                {saved.type !== "Stop on Incorrect" && (

                  <div className="bg-white/20 backdrop-blur-md rounded-3xl p-6 md:p-8 min-w-[140px] border border-white">
                    <span className="text-white/60 text-xs font-black uppercase tracking-widest block mb-2">
                      Attempt
                    </span>
                    <span className="text-white text-5xl md:text-6xl font-black">
                      {curindex + 1}
                    </span>

                  </div>
                )}

                <div className="bg-white/20 backdrop-blur-md rounded-3xl p-6 md:p-8 min-w-[140px] border border-white">
                  <span className="text-white/60 text-xs font-black uppercase tracking-widest block mb-2">
                    Time taken
                  </span>

                  <span className="text-white text-5xl md:text-6xl  font-black">
                    {QuizTimeTaken >= 60
                      ? `${Math.floor(QuizTimeTaken / 60)}:${(QuizTimeTaken % 60).toString().padStart(2, "0")}`
                      : `${QuizTimeTaken}s`}</span>

                </div>




              </div>

              <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(180px,1fr))]">
                <button
                  onClick={() => {
                    if (saved.type === "timed") setTimeLeft(timeLimit);
                    setstatus("playing");
                    setscore(0);
                    setcurindex(0);
                    setAnswers({});
                    setQuizTimeTaken(0);
                    setQuestionTimes({});
                    setPanalysis([])
                  }}
                  className="bg-white  text-gray-900 rounded-2xl py-4 font-bold hover:shadow-xl transition-all active:scale-95"
                >
                  <i className="ri-refresh-line mr-2"></i> Try Again
                </button>
                <button
                  onClick={() => navigate("/qchose")}
                  className="bg-white/20 text-white rounded-2xl py-4 font-bold border border-white hover:bg-white/30 transition-all active:scale-95"
                >
                  Switch Mode
                </button>
                <button
                  onClick={handleRandomQuiz}
                  className="bg-white/20 text-white rounded-2xl py-4 font-bold border border-white hover:bg-white/30 transition-all active:scale-95"
                >
                  Random Quiz
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="bg-white/20 text-white rounded-2xl py-4 font-bold border border-white hover:bg-white/30 transition-all active:scale-95"
                >
                  Home
                </button>
                <button
                  onClick={() =>setshowpopup(prev=>!prev)}
                  className="bg-white/20 text-white rounded-2xl py-4 font-bold border border-white hover:bg-white/30 transition-all active:scale-95"
                >
                 <span> <i class="text-lg ri-save-line"></i></span>
                 <span> Save Stats</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Testwindow;
