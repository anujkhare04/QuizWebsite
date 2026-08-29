import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRandomQuiz, toRandomQuizPlayState } from '../api/createApi';

const Random = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const startRandomQuiz = async () => {
      try {
        const quiz = await getRandomQuiz();
        const quizSettings = toRandomQuizPlayState(quiz);

        if (!quizSettings) {
          alert("No quizzes available to play!");
          navigate("/");
          return;
        }

        navigate(`/categories/${quiz.category}`, {
          state: { quizData: quizSettings }
        });

      } catch (error) {
        console.error("Failed to start random quiz:", error);
        navigate("/");
      }
    };

    startRandomQuiz();
  }, [navigate]);

  return (
    <div className='bg-linear-to-r from-orange-200 via-purple-500 to-pink-500 min-h-screen flex items-center justify-center'>
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white mx-auto mb-4"></div>
        <h1 className='text-2xl font-bold text-white'>Loading Random Quiz...</h1>
      </div>
    </div>
  );
};

export default Random;
