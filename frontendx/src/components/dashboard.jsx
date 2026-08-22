import { useNavigate } from "react-router-dom";


const DashboardTabs = ({ setActiveTab }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-wrap justify-center gap-2 md:gap-6 p-4 md:p-5 fixed top-0 left-0 w-full z-50 bg-black/95 backdrop-blur-sm items-center border-b border-[#ECFEFF]/30">
     
      <button onClick={() => navigate("/")} className="absolute left-4 top-4 z-50">
       
        <span className="md:hidden bg-[#ECFEFF] rounded-xl p-2 active:scale-95 text-black f3 font-semibold flex items-center justify-center">
          <i className="ri-arrow-left-line text-xl"></i>
        </span>
       
        <span className="hidden md:block bg-[#ECFEFF] rounded-xl px-4 py-2 active:scale-95 text-black f3 font-semibold">
          Back
        </span>
      </button>
        
    
      <button className="md:hidden cursor-pointer text-[#ECFEFF] flex items-center justify-center w-10 h-10 rounded-xl shadow-lg transition-all duration-300 active:scale-95 bg-[#111111] border border-[#ECFEFF]/70 hover:bg-[#171717]" onClick={() => setActiveTab("profile")} title="Profile">
       <i className="ri-user-3-fill"></i>
      </button>

      <button className="md:hidden cursor-pointer text-[#ECFEFF] flex items-center justify-center w-10 h-10 rounded-xl shadow-lg transition-all duration-300 active:scale-95 bg-[#111111] border border-[#ECFEFF]/70 hover:bg-[#171717]" onClick={() => setActiveTab("performance")} title="Performance">
       <i className="ri-line-chart-fill"></i>
      </button>

      <button className="md:hidden cursor-pointer text-[#ECFEFF] flex items-center justify-center w-10 h-10 rounded-xl shadow-lg transition-all duration-300 active:scale-95 bg-[#111111] border border-[#ECFEFF]/70 hover:bg-[#171717]" onClick={() => setActiveTab("leaderboard")} title="Leaderboard">
       <i className="ri-trophy-fill"></i>
      </button>

      <button className="md:hidden cursor-pointer text-[#ECFEFF] flex items-center justify-center w-10 h-10 rounded-xl shadow-lg transition-all duration-300 active:scale-95 bg-[#111111] border border-[#ECFEFF]/70 hover:bg-[#171717]" onClick={() => setActiveTab("badges")} title="Badges">
       <i className="ri-medal-fill"></i>
      </button>

      <button className="md:hidden cursor-pointer text-[#ECFEFF] flex items-center justify-center w-10 h-10 rounded-xl shadow-lg transition-all duration-300 active:scale-95 bg-[#111111] border border-[#ECFEFF]/70 hover:bg-[#171717]" onClick={() => setActiveTab("ai")} title="AI Suggestion">
       <i className="ri-robot-3-fill"></i>
      </button>

      <button className="md:hidden cursor-pointer text-[#ECFEFF] flex items-center justify-center w-10 h-10 rounded-xl shadow-lg transition-all duration-300 active:scale-95 bg-[#111111] border border-[#ECFEFF]/70 hover:bg-[#171717]" onClick={() => setActiveTab("quizzes")} title="View Quiz">
       <i className="ri-file-list-3-fill"></i>
      </button>

    
      <button className="hidden md:flex cursor-pointer text-[#ECFEFF] items-center justify-center gap-3 px-4 py-3 text-sm md:text-base rounded-xl shadow-lg transition-all duration-300 active:scale-95 bg-[#111111] border-2 border-[#ECFEFF]/70 hover:border-[#ECFEFF] hover:bg-[#171717]" onClick={() => setActiveTab("profile")}>
       <i className="text-sm ri-user-3-fill"></i> Profile
      </button>

      <button className="hidden md:flex cursor-pointer text-[#ECFEFF] items-center justify-center gap-3 px-4 py-3 text-sm md:text-base rounded-xl shadow-lg transition-all duration-300 active:scale-95 bg-[#111111] border-2 border-[#ECFEFF]/70 hover:border-[#ECFEFF]/70 hover:bg-[#171717]" onClick={() => setActiveTab("performance")}>
       <i className="text-sm ri-line-chart-fill"></i> Performance
      </button>

      <button className="hidden md:flex cursor-pointer text-[#ECFEFF] items-center justify-center gap-3 px-4 py-3 text-sm md:text-base rounded-xl shadow-lg transition-all duration-300 active:scale-95 bg-[#111111] border-2 border-[#ECFEFF]/70 hover:border-[#ECFEFF]/70 hover:bg-[#171717]" onClick={() => setActiveTab("leaderboard")}>
       <i className="text-sm ri-trophy-fill"></i> Leaderboard
      </button>

      <button className="hidden md:flex cursor-pointer text-[#ECFEFF] items-center justify-center gap-3 px-4 py-3 text-sm md:text-base rounded-xl shadow-lg transition-all duration-300 active:scale-95 bg-[#111111] border-2 border-[#ECFEFF]/70 hover:border-[#ECFEFF]/70 hover:bg-[#171717]" onClick={() => setActiveTab("badges")}>
       <i className="text-sm ri-medal-fill"></i> Badges
      </button>

      <button className="hidden md:flex cursor-pointer text-[#ECFEFF] items-center justify-center gap-3 px-4 py-3 text-sm md:text-base rounded-xl shadow-lg transition-all duration-300 active:scale-95 bg-[#111111] border-2 border-[#ECFEFF]/70 hover:border-[#ECFEFF]/70 hover:bg-[#171717]" onClick={() => setActiveTab("ai")}>
       <i className="text-sm ri-robot-3-fill"></i> AI Suggestion
      </button>

      <button className="hidden md:flex cursor-pointer text-[#ECFEFF] items-center justify-center gap-3 px-4 py-3 text-sm md:text-base rounded-xl shadow-lg transition-all duration-300 active:scale-95 bg-[#111111] border-2 border-[#ECFEFF]/70 hover:border-[#ECFEFF]/70 hover:bg-[#171717]" onClick={() => setActiveTab("quizzes")}>
       <i className="text-sm ri-file-list-3-fill"></i> View Quiz
      </button>

    </div>
  );
};

export default DashboardTabs;
