
import { useState} from "react";
import AISuggestions from "../components/aisuggestion";
import Leaderboard from "../components/leaderboard";
import Profile from "../components/profile";
import Performance from "../components/performance";
import DashboardTabs from "../components/dashboard";
import BadgesPage from "../components/badges";
import YourQuizzes from "../components/yourquizzes";

const Dashboard = () => {


  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="w-full pt-28 bg-black">
      <DashboardTabs setActiveTab={setActiveTab} />

      {activeTab === "profile" && <Profile />}
      {activeTab === "performance" && <Performance />}
      {activeTab === "leaderboard" && <Leaderboard />}
      {activeTab === "badges" && <BadgesPage />}
      {activeTab === "ai" && <AISuggestions />}
      {activeTab === "quizzes" && <YourQuizzes />}

    </div>
  );
};


export default Dashboard
