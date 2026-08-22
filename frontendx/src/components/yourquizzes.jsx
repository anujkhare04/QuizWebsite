import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyQuizzes } from "../api/createApi";

const YourQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyQuizzes()
      .then(setQuizzes)
      .catch(() => setQuizzes([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-10 sm:px-6">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300 f3">Your library</p>
          <h2 className="mt-2 text-3xl font-black text-white f3">View Quiz</h2>
        </div>
        <Link to="/create-quiz" className="inline-flex w-fit items-center rounded-xl bg-[#ECFEFF] px-4 py-3 text-sm font-bold text-black transition hover:bg-white active:scale-95 f3">
          <i className="ri-add-line mr-1"></i> Create Quiz
        </Link>
      </div>

      {loading ? (
        <p className="text-white/60 f3">Loading your quizzes...</p>
      ) : quizzes.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/20 bg-white/4 p-10 text-center">
          <i className="ri-file-list-3-line text-5xl text-cyan-300"></i>
          <h3 className="mt-4 text-2xl font-bold text-white f3">No quizzes yet</h3>
          <p className="mt-2 text-white/60 f3">Create your first quiz and build your library.</p>
          <Link to="/create-quiz" className="mt-6 inline-flex rounded-xl bg-cyan-300 px-5 py-3 font-bold text-black transition hover:bg-cyan-200 active:scale-95 f3">
            Create Your First Quiz
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quizzes.map((quiz) => (
            <article key={quiz._id} className="rounded-2xl border border-white/10 bg-white/6 p-5 shadow-xl">
              <p className="text-xs font-bold uppercase tracking-widest text-cyan-300 f3">{quiz.category}</p>
              <h3 className="mt-3 text-xl font-bold text-white f3">{quiz.title || "Untitled Quiz"}</h3>
              <p className="mt-2 text-sm text-white/60 f3">{quiz.questions?.length || 0} questions</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default YourQuizzes;
