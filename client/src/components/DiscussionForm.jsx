import { useState } from "react";

import toast from "react-hot-toast";

import API from "../services/api";

const DiscussionForm = ({
  fetchDiscussions,
}) => {

  // USER DATA
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  // CURRENT USER
  const currentUser =
    user?.username ||
    user?.email?.split("@")[0] ||
    user?.name ||
    "User";

  // FORM STATE
  const [formData, setFormData] =
    useState({
      title: "",
      content: "",
      category: "General",
    });

  // LOADING STATE
  const [loading, setLoading] =
    useState(false);


  // HANDLE INPUT CHANGE
  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });

  };


  // HANDLE SUBMIT
  const handleSubmit = async (
    e
  ) => {

    e.preventDefault();

    // VALIDATION
    if (
      !formData.title.trim() ||
      !formData.content.trim()
    ) {

      return toast.error(
        "Please fill all fields"
      );

    }

    try {

      setLoading(true);

      await API.post(
        "/discussions",
        {
          ...formData,
          author: currentUser,
        }
      );

      toast.success(
        "Discussion Created Successfully"
      );

      // RESET FORM
      setFormData({
        title: "",
        content: "",
        category: "General",
      });

      // REFRESH DISCUSSIONS
      fetchDiscussions();

    } catch (error) {

      toast.error(
        error?.response?.data
          ?.message ||
          "Something went wrong"
      );

    } finally {

      setLoading(false);

    }

  };


  return (
    <form
      onSubmit={handleSubmit}
      className="bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-700 mb-8"
    >

      {/* HEADER */}
      <div className="mb-6">

        <h2 className="text-3xl font-bold mb-2">

          Create Discussion

        </h2>

        <p className="text-slate-400">

          Share your ideas with the community.

        </p>

      </div>


      {/* TITLE */}
      <div className="mb-4">

        <label className="block mb-2 text-sm text-slate-300">

          Discussion Title

        </label>

        <input
          type="text"
          name="title"
          placeholder="Enter discussion title"
          value={formData.title}
          onChange={handleChange}
          className="w-full p-4 rounded-xl bg-slate-700 outline-none border border-slate-600 focus:border-blue-500 transition"
        />

      </div>


      {/* CATEGORY */}
      <div className="mb-4">

        <label className="block mb-2 text-sm text-slate-300">

          Select Category

        </label>

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full p-4 rounded-xl bg-slate-700 outline-none border border-slate-600 focus:border-blue-500 transition"
        >

          <option value="General">
            General
          </option>

          <option value="Web Development">
            Web Development
          </option>

          <option value="AI/ML">
            AI / ML
          </option>

          <option value="React">
            React
          </option>

          <option value="Node.js">
            Node.js
          </option>

          <option value="JavaScript">
            JavaScript
          </option>

          <option value="MongoDB">
            MongoDB
          </option>

          <option value="Career">
            Career
          </option>

        </select>

      </div>


      {/* CONTENT */}
      <div className="mb-6">

        <label className="block mb-2 text-sm text-slate-300">

          Discussion Content

        </label>

        <textarea
          name="content"
          placeholder="Write your discussion..."
          value={formData.content}
          onChange={handleChange}
          rows="6"
          className="w-full p-4 rounded-xl bg-slate-700 outline-none border border-slate-600 focus:border-blue-500 transition resize-none"
        />

      </div>


      {/* FOOTER */}
      <div className="flex justify-between items-center">

        <p className="text-slate-400 text-sm">

          Posting as:
          {" "}
          <span className="text-blue-400 font-semibold">

            {currentUser}

          </span>

        </p>


        <button
          type="submit"
          disabled={loading}
          className={`px-8 py-3 rounded-xl font-semibold transition ${
            loading
              ? "bg-slate-600 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >

          {loading
            ? "Posting..."
            : "Post Discussion"}

        </button>

      </div>

    </form>
  );
};

export default DiscussionForm;