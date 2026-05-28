import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import API from "../services/api";

import DiscussionForm from "../components/DiscussionForm";

import DiscussionCard from "../components/DiscussionCard";

const Home = () => {

  // =========================
  // STATES
  // =========================
  const [user, setUser] =
    useState(null);

  const [discussions, setDiscussions] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState("All");


  // =========================
  // CURRENT USER
  // =========================
  const currentUser =
    user?.username ||
    user?.email?.split("@")[0] ||
    user?.name ||
    "User";


  // =========================
  // FETCH USER + DISCUSSIONS
  // =========================
  useEffect(() => {

    const storedUser =
      localStorage.getItem("user");

    if (storedUser) {

      setUser(
        JSON.parse(storedUser)
      );

    }

    fetchDiscussions();

  }, []);


  // =========================
  // FETCH DISCUSSIONS
  // =========================
  const fetchDiscussions =
    async () => {

      try {

        const response =
          await API.get(
            "/discussions"
          );

        setDiscussions(
          response.data
        );

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }

    };


  // =========================
  // LOGOUT
  // =========================
  const logoutHandler = () => {

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );

    window.location.reload();

  };


  // =========================
  // FILTER DISCUSSIONS
  // =========================
  const filteredDiscussions =
    discussions.filter(
      (discussion) => {

        if (
          selectedCategory === "All"
        ) {

          return true;

        }

        return (
          discussion.category ===
          selectedCategory
        );

      }
    );


  return (
    <div className="min-h-screen bg-slate-900 text-white">

      {/* ========================= */}
      {/* NAVBAR */}
      {/* ========================= */}
      <div className="bg-slate-800 shadow-lg sticky top-0 z-50 border-b border-slate-700">

        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">

          {/* LOGO */}
          <div>

            <h1 className="text-3xl font-bold">

              Community Forum

            </h1>

            <p className="text-slate-400 text-sm">

              Real-Time MERN Discussion Platform

            </p>

          </div>


          {/* USER ACTIONS */}
          {user ? (

            <div className="flex items-center gap-4">

              {/* USER INFO */}
              <div className="hidden md:flex flex-col items-end">

                <span className="text-sm text-slate-400">

                  Logged in as

                </span>

                <h2 className="font-semibold">

                  {currentUser}

                </h2>

              </div>


              {/* BUTTONS */}
              <div className="flex gap-3">

                <Link
                  to="/chat"
                  className="bg-blue-600 hover:bg-blue-700 transition px-5 py-2 rounded-xl font-medium shadow"
                >

                  Chat

                </Link>


                <Link
                  to="/admin"
                  className="bg-purple-600 hover:bg-purple-700 transition px-5 py-2 rounded-xl font-medium shadow"
                >

                  Admin

                </Link>


                <button
                  onClick={logoutHandler}
                  className="bg-red-600 hover:bg-red-700 transition px-5 py-2 rounded-xl font-medium shadow"
                >

                  Logout

                </button>

              </div>

            </div>

          ) : (

            <div className="flex gap-4">

              <Link
                to="/login"
                className="bg-green-600 hover:bg-green-700 transition px-5 py-2 rounded-xl font-medium shadow"
              >

                Login

              </Link>


              <Link
                to="/register"
                className="bg-blue-600 hover:bg-blue-700 transition px-5 py-2 rounded-xl font-medium shadow"
              >

                Register

              </Link>

            </div>

          )}

        </div>

      </div>


      {/* ========================= */}
      {/* HERO SECTION */}
      {/* ========================= */}
      <div className="text-center py-20 px-6">

        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">

          Real-Time Community
          <br />

          Discussion Platform

        </h1>

        <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">

          Connect with developers,
          share ideas, discuss
          technology, and communicate
          in real-time using MERN Stack
          and Socket.IO.

        </p>

      </div>


      {/* ========================= */}
      {/* MAIN CONTENT */}
      {/* ========================= */}
      <div className="max-w-5xl mx-auto px-6 pb-20">

        {/* DISCUSSION FORM */}
        {user && (

          <DiscussionForm
            fetchDiscussions={
              fetchDiscussions
            }
          />

        )}


        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">

          <div>

            <h2 className="text-3xl font-bold mb-1">

              Latest Discussions

            </h2>

            <p className="text-slate-400">

              Browse community posts

            </p>

          </div>


          <span className="text-slate-400">

            {filteredDiscussions.length}
            {" "}
            Post
            {filteredDiscussions.length !== 1
              ? "s"
              : ""}

          </span>

        </div>


        {/* ========================= */}
        {/* CATEGORY FILTERS */}
        {/* ========================= */}
        <div className="flex flex-wrap gap-3 mb-10">

          {[
            "All",
            "General",
            "Web Development",
            "AI/ML",
            "React",
            "Node.js",
            "JavaScript",
            "MongoDB",
            "Career",
          ].map((category) => (

            <button
              key={category}
              onClick={() =>
                setSelectedCategory(
                  category
                )
              }
              className={`px-4 py-2 rounded-full transition font-medium shadow ${
                selectedCategory ===
                category
                  ? "bg-blue-600"
                  : "bg-slate-700 hover:bg-slate-600"
              }`}
            >

              {category}

            </button>

          ))}

        </div>


        {/* ========================= */}
        {/* DISCUSSIONS */}
        {/* ========================= */}
        {loading ? (

          <div className="text-center py-20">

            <h2 className="text-2xl text-slate-400">

              Loading Discussions...

            </h2>

          </div>

        ) : filteredDiscussions.length > 0 ? (

          <div className="space-y-6">

            {filteredDiscussions.map(
              (discussion) => (

                <DiscussionCard
                  key={discussion._id}
                  discussion={
                    discussion
                  }
                />

              )
            )}

          </div>

        ) : (

          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-16 text-center shadow-lg">

            <h2 className="text-3xl font-bold mb-4">

              No Discussions Found

            </h2>

            <p className="text-slate-400">

              No posts available in this category.

            </p>

          </div>

        )}

      </div>


      {/* ========================= */}
      {/* FOOTER */}
      {/* ========================= */}
      <div className="bg-slate-800 border-t border-slate-700">

        <div className="max-w-7xl mx-auto px-6 py-6 text-center text-slate-400">

          © 2026 Community Forum • Built with MERN Stack & Socket.IO

        </div>

      </div>

    </div>
  );
};

export default Home;