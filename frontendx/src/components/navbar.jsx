import React from "react";
import Logo from "./Logo";
import { removeuser } from "../feature/auth.slice";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getAllCategories, getMyQuizzes } from "../api/createApi";
import { logoutUser } from "../api/authapi";
import { useState } from "react";



const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const currentUser = user?.user ?? user;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
   const [loading2, setLoading2] = useState(true);
  const [hasUserQuizzes, setHasUserQuizzes] = useState(false);



  const [isOpen, setIsOpen] = useState(false);

  React.useEffect(() => {
    if (!user) {
      setHasUserQuizzes(false);
      return;
    }

    getMyQuizzes()
      .then((quizzes) => setHasUserQuizzes(Array.isArray(quizzes) && quizzes.length > 0))
      .catch(() => setHasUserQuizzes(false));
  }, [user]);

  const handleClick = () => {
    setLoading(true);
    setIsOpen(false);
    setTimeout(() => {
      window.location.reload();
    }, 4000);
  };
   
   console.log("USER VALUE:", user);
 
  
  const handleClick2 = () => {

    

    setTimeout(() => {
      navigate("/qchose"); 
    }, 1000);



  };

  const handleRandomQuiz = async () => {
    setIsOpen(false);
    try {
      const categories = await getAllCategories();
      if (!categories || categories.length === 0) {
        alert("No categories available to play!");
        return;
      }
      const randomCat = categories[Math.floor(Math.random() * categories.length)];
      const modes = ["numberOfQuestions", "timed", "Stop on Incorrect"];
      const randomMode = modes[Math.floor(Math.random() * modes.length)];
      let quizSettings = {
        category: randomCat,
        type: randomMode
      };
      if (randomMode === "numberOfQuestions") {
        quizSettings.questionLimit = Math.floor(Math.random() * (10 - 5 + 1)) + 5;
      } else if (randomMode === "timed") {
        quizSettings.timeLimit = Math.floor(Math.random() * 5) + 1;
      }
      navigate(`/categories/${randomCat}`, {
        state: { quizData: quizSettings }
      });
    } catch (error) {
      console.error("Failed to start random quiz:", error);
    }
  };

  

  return (

    <nav className={`backdrop-blur-md bg-black border-b-2 shadow-xl z-50 fixed top-0 w-full transition-all duration-300 
       
    `}>
         { loading &&
          <h1 className="h-1 w-full bg-linear-to-r from-green-600 via-red-500 to-yellow-500 animate-pulse z-50 fixed top-20"></h1>                    
         }

      <div className="max-w-7xl mx-auto px-4 sm:px-2 lg:px-2">
        <div className="flex items-center justify-between h-20">
          <Link to="/">
                  <Logo/>
          </Link>
         
                
          <div className="hidden md:flex items-center justify-between gap-3">
            
            <Link
              to="/create-quiz"
              className="px-4 py-2 text-white font-medium rounded-full hover:bg-white/10 transition-all duration-300 border-2 "
            >
              Create Quiz
            </Link>

            {user ? (
              <>
               
                <Link
                  to="/Dashboard"
                  className="hidden md:flex px-2 py-2 text-white font-medium rounded-full hover:bg-white/10 transition-all duration-300 border-2 items-center gap-2"
                >
                  {currentUser?.img ? (
                    <img src={currentUser.img} alt="avatar" className="w-6 h-6 rounded-full object-cover" />
                  ) : (
                    <i className="ri-user-fill"></i>
                  )}
                  <span className="hidden lg:inline">Profile</span>
                </Link>

               
                <button
                  onClick={async () => {
                    setIsOpen(false);
                    await logoutUser();
                    dispatch(removeuser());
                    navigate("/login");
                  }}
                  className="md:hidden px-2 py-2 text-red-400 font-medium rounded-full hover:bg-red-500/10 transition-all duration-300 border-2 border-red-400/50"
                  title="Logout"
                >
                  <i className="ri-logout-box-line text-xl"></i>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 text-white font-medium rounded-full hover:bg-white/10 transition-all duration-300 border-2 "
              >
                Login
              </Link>
            
)}
            <button
              onClick={handleRandomQuiz}
              className="px-4 py-2 text-white font-medium rounded-full hover:bg-white/10 transition-all duration-300 border-2 "
            >
              Random Quiz
            </button>
            
 

  {user && hasUserQuizzes && (
    <button
      onClick={handleClick2}
      className="f3 px-3 py-2 from-black to-green-600 text-purple-600 font-bold rounded-full shadow-xl border-2 hover:shadow-2xl active:scale-95 transition-all duration-300 flex items-center gap-2 group"
    >
      <span>PlayGround</span>
      <i className="ri-arrow-right-line group-hover:translate-x-1 transition-transform"></i>
    </button>
  )}
  
 </div>
 
 
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-white/80 p-2"
            >
              <i
                className={
                  isOpen ? "ri-close-line text-2xl" : "ri-menu-line text-2xl"
                }
              ></i>
            </button>
          </div>
        </div>
      </div>

      <div
        className={`${isOpen ? "block" : "hidden"} md:hidden bg-black/60 backdrop-blur-lg border-t border-white/10`}
      >
        <div className="px-4 pt-2 pb-6 space-y-2">
          <Link
            to="/"
            onClick={handleClick}
            className="block px-4 py-3 text-white font-medium rounded-xl hover:bg-white/10 transition-all"
          >
            Home
          </Link>
          <Link
            to="/create-quiz"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-3 text-white font-medium rounded-xl hover:bg-white/10 transition-all"
          >
            Create Quiz
          </Link>
          <button
            onClick={handleRandomQuiz}
            className="w-full text-left px-4 py-3 text-white font-medium rounded-xl hover:bg-white/10 transition-all border border-white/10 mt-2"
          >
            Random Quiz
          </button>

          {user && hasUserQuizzes && (
            <button
              onClick={handleClick2}
              className="flex w-full items-center justify-between rounded-xl border-2 border-white bg-white px-4 py-3 text-left font-bold text-purple-600 transition-all hover:bg-white/90 active:scale-[0.98] f3"
            >
              <span>PlayGround</span>
              <i className="ri-arrow-right-line"></i>
            </button>
          )}

          

          {user ? (
            <>
              <Link
                to="/Dashboard"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-white font-medium rounded-xl hover:bg-white/10 transition-all"
              >
                {currentUser?.img ? (
                  <span className="inline-flex items-center gap-2">
                    <img src={currentUser.img} alt="avatar" className="w-6 h-6 rounded-full object-cover" />
                    Profile
                  </span>
                ) : (
                  <>
                    <i className="ri-user-fill"></i> Profile
                  </>
                )}
              </Link>

              <button
                onClick={async () => {
                  setIsOpen(false);
                  await logoutUser();
                  dispatch(removeuser());
                  navigate("/login");
                }}
                className="w-full text-left px-4 py-3 text-red-400 font-medium rounded-xl hover:bg-red-500/10 transition-all flex items-center gap-2"
              >
                <i className="ri-logout-box-line"></i> Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-3 text-white font-medium rounded-xl hover:bg-white/10 transition-all"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav >
  );
};

export default Navbar;
