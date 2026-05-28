import { useState } from "react";

import API from "../services/api";

import toast from "react-hot-toast";

const DiscussionCard = ({
  discussion,
}) => {

  // =========================
  // USER DATA
  // =========================
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const currentUser =
    user?.username ||
    user?.email?.split("@")[0] ||
    user?.name ||
    "User";


  // =========================
  // AVATAR
  // =========================
  const avatarLetter =
    discussion?.author
      ?.charAt(0)
      ?.toUpperCase() || "U";


  // =========================
  // STATES
  // =========================
  const [likes, setLikes] =
    useState(
      discussion?.likes || 0
    );

  const [comment, setComment] =
    useState("");

  const [comments, setComments] =
    useState(
      discussion?.comments || []
    );

  const [loading, setLoading] =
    useState(false);


  // =========================
  // LIKE HANDLER
  // =========================
  const likeHandler = async () => {

    try {

      const response =
        await API.put(
          `/discussions/like/${discussion._id}`
        );

      setLikes(
        response.data.likes
      );

      toast.success(
        "Discussion Liked"
      );

    } catch (error) {

      toast.error(
        "Failed to like discussion"
      );

    }

  };


  // =========================
  // COMMENT HANDLER
  // =========================
  const commentHandler = async () => {

    if (!comment.trim()) {

      return toast.error(
        "Comment cannot be empty"
      );

    }

    try {

      setLoading(true);

      const response =
        await API.post(
          `/discussions/comment/${discussion._id}`,
          {
            user: currentUser,
            text: comment,
          }
        );

      setComments(
        response.data.discussion
          .comments
      );

      setComment("");

      toast.success(
        "Comment Added"
      );

    } catch (error) {

      toast.error(
        "Failed to add comment"
      );

    } finally {

      setLoading(false);

    }

  };


  return (
    <div className="bg-slate-800 border border-slate-700 hover:border-blue-500 transition duration-300 rounded-2xl shadow-lg p-6">

      {/* ========================= */}
      {/* HEADER */}
      {/* ========================= */}
      <div className="flex justify-between items-start gap-4 mb-5">

        <div className="flex items-center gap-4">

          {/* AVATAR */}
          <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-xl font-bold shadow-md">

            {avatarLetter}

          </div>


          {/* USER INFO */}
          <div>

            <h2 className="font-bold text-lg">

              {discussion?.author}

            </h2>

            <p className="text-sm text-slate-400">

              Community Member

            </p>

          </div>

        </div>


        {/* DATE */}
        <span className="text-slate-400 text-xs md:text-sm text-right">

          {new Date(
            discussion?.createdAt
          ).toLocaleString()}

        </span>

      </div>


      {/* ========================= */}
      {/* TITLE */}
      {/* ========================= */}
      <h2 className="text-2xl font-bold mb-4 leading-snug">

        {discussion?.title}

      </h2>


      {/* ========================= */}
      {/* CATEGORY */}
      {/* ========================= */}
      <div className="mb-4">

        <span className="bg-blue-600 px-3 py-1 rounded-full text-sm font-medium shadow">

          {discussion?.category ||
            "General"}

        </span>

      </div>


      {/* ========================= */}
      {/* CONTENT */}
      {/* ========================= */}
      <p className="text-slate-300 leading-relaxed mb-6 whitespace-pre-line">

        {discussion?.content}

      </p>


      {/* ========================= */}
      {/* ACTIONS */}
      {/* ========================= */}
      <div className="flex flex-wrap items-center gap-4 mb-6">

        {/* LIKE BUTTON */}
        <button
          onClick={likeHandler}
          className="bg-pink-600 hover:bg-pink-700 transition px-5 py-2 rounded-lg font-medium shadow"
        >

          ❤️ {likes}

        </button>


        {/* COMMENT COUNT */}
        <div className="text-slate-400 text-sm">

          💬 {comments.length} Comment
          {comments.length !== 1
            ? "s"
            : ""}

        </div>

      </div>


      {/* ========================= */}
      {/* COMMENT INPUT */}
      {/* ========================= */}
      <div className="flex flex-col md:flex-row gap-3 mb-5">

        <input
          type="text"
          placeholder="Write a comment..."
          value={comment}
          onChange={(e) =>
            setComment(
              e.target.value
            )
          }
          className="flex-1 p-3 rounded-lg bg-slate-700 outline-none border border-slate-600 focus:border-blue-500 transition"
        />

        <button
          onClick={commentHandler}
          disabled={loading}
          className={`px-5 py-3 rounded-lg font-medium shadow transition ${
            loading
              ? "bg-slate-600 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >

          {loading
            ? "Posting..."
            : "Comment"}

        </button>

      </div>


      {/* ========================= */}
      {/* COMMENTS */}
      {/* ========================= */}
      <div className="space-y-3">

        {comments.length > 0 ? (

          comments.map(
            (
              comment,
              index
            ) => (

              <div
                key={index}
                className="bg-slate-700 border border-slate-600 p-4 rounded-xl"
              >

                <div className="flex justify-between items-center mb-2">

                  <h3 className="font-bold text-blue-400">

                    {comment.user}

                  </h3>

                  <span className="text-xs text-slate-400">

                    {comment?.createdAt
                      ? new Date(
                          comment.createdAt
                        ).toLocaleString()
                      : "Just now"}

                  </span>

                </div>

                <p className="text-slate-300 break-words">

                  {comment.text}

                </p>

              </div>

            )
          )

        ) : (

          <div className="bg-slate-700 border border-slate-600 rounded-xl p-4 text-center">

            <p className="text-slate-400 italic">

              No comments yet

            </p>

          </div>

        )}

      </div>

    </div>
  );
};

export default DiscussionCard;