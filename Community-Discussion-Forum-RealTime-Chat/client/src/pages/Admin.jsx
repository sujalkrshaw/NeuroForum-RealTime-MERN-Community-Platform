import { useEffect, useMemo, useState } from "react";

import { Link } from "react-router-dom";

import toast from "react-hot-toast";

import API from "../services/api";

import {
  LayoutDashboard,
  MessageSquare,
  Heart,
  Users,
  Trash2,
  Search,
  Bell,
  Activity,
  PieChart as PieChartIcon,
  TrendingUp,
} from "lucide-react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

import { motion } from "framer-motion";

const Admin = () => {

  // =========================
  // STATES
  // =========================
  const [discussions, setDiscussions] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [activeTab, setActiveTab] =
    useState("dashboard");


  // =========================
  // FETCH DISCUSSIONS
  // =========================
  useEffect(() => {

    fetchDiscussions();

  }, []);


  const fetchDiscussions =
    async () => {

      try {

        const response =
          await API.get(
            "/discussions"
          );

        setDiscussions(
          response.data || []
        );

      } catch (error) {

        toast.error(
          "Failed to load dashboard"
        );

      } finally {

        setLoading(false);

      }

    };


  // =========================
  // DELETE DISCUSSION
  // =========================
  const deleteDiscussion =
    async (id) => {

      const confirmDelete =
        window.confirm(
          "Delete this discussion?"
        );

      if (!confirmDelete) return;

      try {

        await API.delete(
          `/discussions/${id}`
        );

        setDiscussions((prev) =>
          prev.filter(
            (discussion) =>
              discussion._id !== id
          )
        );

        toast.success(
          "Discussion Deleted"
        );

      } catch (error) {

        toast.error(
          "Delete failed"
        );

      }

    };


  // =========================
  // FILTERED DISCUSSIONS
  // =========================
  const filteredDiscussions =
    discussions.filter(
      (discussion) =>
        discussion.title
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );


  // =========================
  // ANALYTICS
  // =========================
  const totalDiscussions =
    discussions.length;

  const totalComments =
    discussions.reduce(
      (acc, discussion) =>
        acc +
        (discussion.comments
          ?.length || 0),
      0
    );

  const totalLikes =
    discussions.reduce(
      (acc, discussion) =>
        acc +
        (discussion.likes || 0),
      0
    );

  const totalCategories =
    new Set(
      discussions.map(
        (discussion) =>
          discussion.category
      )
    ).size;


  // =========================
  // CHART DATA
  // =========================
  const analyticsData = [
    {
      name: "Discussions",
      value: totalDiscussions,
    },

    {
      name: "Comments",
      value: totalComments,
    },

    {
      name: "Likes",
      value: totalLikes,
    },

    {
      name: "Categories",
      value: totalCategories,
    },
  ];


  // =========================
  // CATEGORY DATA
  // =========================
  const categoryData =
    useMemo(() => {

      const map = {};

      discussions.forEach(
        (discussion) => {

          const category =
            discussion.category ||
            "General";

          map[category] =
            (map[category] || 0) + 1;

        }
      );

      return Object.keys(map).map(
        (key) => ({
          name: key,
          value: map[key],
        })
      );

    }, [discussions]);


  // =========================
  // GROWTH DATA
  // =========================
  const growthData =
    discussions.map(
      (discussion, index) => ({
        name: `Post ${index + 1}`,
        likes:
          discussion.likes || 0,
        comments:
          discussion.comments
            ?.length || 0,
      })
    );


  // =========================
  // TOP DISCUSSION
  // =========================
  const topDiscussion =
    [...discussions]
      .sort(
        (a, b) =>
          (b.likes || 0) -
          (a.likes || 0)
      )[0]?.title || "N/A";


  // =========================
  // SIDEBAR MENU
  // =========================
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard />,
    },

    {
      id: "analytics",
      label: "Analytics",
      icon: <Activity />,
    },

    {
      id: "notifications",
      label: "Notifications",
      icon: <Bell />,
    },

    {
      id: "reports",
      label: "Reports",
      icon: <PieChartIcon />,
    },
  ];


  // =========================
  // CARD DATA
  // =========================
  const cards = [
    {
      title: "Discussions",
      value: totalDiscussions,
      icon: <LayoutDashboard />,
      gradient:
        "from-cyan-500 to-blue-500",
    },

    {
      title: "Comments",
      value: totalComments,
      icon: <MessageSquare />,
      gradient:
        "from-green-500 to-emerald-500",
    },

    {
      title: "Likes",
      value: totalLikes,
      icon: <Heart />,
      gradient:
        "from-pink-500 to-rose-500",
    },

    {
      title: "Categories",
      value: totalCategories,
      icon: <Users />,
      gradient:
        "from-purple-500 to-indigo-500",
    },
  ];


  const pieColors = [
    "#06b6d4",
    "#3b82f6",
    "#8b5cf6",
    "#10b981",
    "#ec4899",
  ];


  return (
    <div className="min-h-screen bg-black text-white flex">

      {/* SIDEBAR */}
      <div className="w-[280px] bg-slate-950 border-r border-slate-800 hidden lg:flex flex-col p-6">

        <div className="mb-10">

          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">

            NeuroForum

          </h1>

          <p className="text-slate-500 mt-2">

            AI Analytics Dashboard

          </p>

        </div>


        <div className="space-y-4">

          {menuItems.map((item) => (

            <button
              key={item.id}
              onClick={() =>
                setActiveTab(item.id)
              }
              className={`w-full flex items-center gap-4 p-4 rounded-2xl transition ${
                activeTab === item.id
                  ? "bg-blue-600 shadow-lg shadow-blue-500/30"
                  : "bg-slate-900 hover:bg-slate-800"
              }`}
            >

              {item.icon}

              <span>
                {item.label}
              </span>

            </button>

          ))}

        </div>


        <div className="mt-auto">

          <Link
            to="/"
            className="bg-blue-600 hover:bg-blue-700 transition w-full py-4 rounded-2xl flex justify-center font-semibold"
          >

            Back To Home

          </Link>

        </div>

      </div>


      {/* MAIN */}
      <div className="flex-1 overflow-y-auto relative">

        {/* BACKGROUND GLOW */}
        <div className="absolute top-[-200px] right-[-200px] w-[500px] h-[500px] bg-cyan-500 opacity-20 blur-[150px] rounded-full" />

        <div className="absolute bottom-[-200px] left-[-200px] w-[500px] h-[500px] bg-purple-500 opacity-20 blur-[150px] rounded-full" />


        {/* TOPBAR */}
        <div className="sticky top-0 z-50 backdrop-blur-xl bg-black/30 border-b border-slate-800 px-8 py-5 flex justify-between items-center">

          <div>

            <h1 className="text-4xl font-extrabold">

              Admin Dashboard

            </h1>

            <p className="text-slate-400 mt-1">

              Real-Time Community Intelligence

            </p>

          </div>


          <div className="relative">

            <Search
              className="absolute left-4 top-3.5 text-slate-400"
              size={18}
            />

            <input
              type="text"
              placeholder="Search discussions..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-5 py-3 outline-none w-[280px]"
            />

          </div>

        </div>


        {/* CONTENT */}
        <div className="p-8">

          {loading ? (

            <div className="text-center py-20">

              <h2 className="text-3xl text-slate-400">

                Loading Dashboard...

              </h2>

            </div>

          ) : (

            <motion.div
              key={activeTab}
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.4,
              }}
            >

              {/* DASHBOARD */}
              {activeTab === "dashboard" && (

                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">

                    {cards.map(
                      (
                        card,
                        index
                      ) => (

                        <div
                          key={index}
                          className={`bg-gradient-to-br ${card.gradient} p-[1px] rounded-3xl`}
                        >

                          <div className="bg-slate-950 rounded-3xl p-6">

                            <div className="flex justify-between items-center mb-6">

                              <div className="bg-slate-900 p-4 rounded-2xl">

                                {card.icon}

                              </div>

                              <span className="text-slate-400 text-sm">

                                Live

                              </span>

                            </div>

                            <h2 className="text-slate-400 mb-2">

                              {card.title}

                            </h2>

                            <h1 className="text-5xl font-extrabold">

                              {card.value}

                            </h1>

                          </div>

                        </div>

                      )
                    )}

                  </div>


                  <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden">

                    <div className="p-6 border-b border-slate-800">

                      <h2 className="text-3xl font-bold">

                        Discussions Management

                      </h2>

                    </div>


                    <div className="overflow-x-auto">

                      <table className="w-full">

                        <thead className="bg-slate-900">

                          <tr>

                            <th className="p-5 text-left">
                              Author
                            </th>

                            <th className="p-5 text-left">
                              Title
                            </th>

                            <th className="p-5 text-left">
                              Category
                            </th>

                            <th className="p-5 text-left">
                              Likes
                            </th>

                            <th className="p-5 text-left">
                              Comments
                            </th>

                            <th className="p-5 text-left">
                              Actions
                            </th>

                          </tr>

                        </thead>


                        <tbody>

                          {filteredDiscussions.map(
                            (
                              discussion
                            ) => (

                              <tr
                                key={
                                  discussion._id
                                }
                                className="border-b border-slate-800 hover:bg-slate-900 transition"
                              >

                                <td className="p-5">
                                  {
                                    discussion.author
                                  }
                                </td>

                                <td className="p-5 font-semibold">
                                  {
                                    discussion.title
                                  }
                                </td>

                                <td className="p-5">

                                  <span className="bg-blue-600 px-3 py-1 rounded-full text-sm">

                                    {
                                      discussion.category
                                    }

                                  </span>

                                </td>

                                <td className="p-5">
                                  ❤️ {
                                    discussion.likes || 0
                                  }
                                </td>

                                <td className="p-5">
                                  {
                                    discussion.comments
                                      ?.length || 0
                                  }
                                </td>

                                <td className="p-5">

                                  <button
                                    onClick={() =>
                                      deleteDiscussion(
                                        discussion._id
                                      )
                                    }
                                    className="bg-red-600 hover:bg-red-700 transition p-3 rounded-xl"
                                  >

                                    <Trash2
                                      size={18}
                                    />

                                  </button>

                                </td>

                              </tr>

                            )
                          )}

                        </tbody>

                      </table>

                    </div>

                  </div>
                </>
              )}


              {/* ANALYTICS */}
              {activeTab === "analytics" && (

                <div className="space-y-10">

                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

                    <div className="bg-slate-950 border border-slate-800 rounded-3xl p-8">

                      <h2 className="text-2xl font-bold mb-8">

                        Platform Analytics

                      </h2>

                      <div className="h-[350px]">

                        <ResponsiveContainer
                          width="100%"
                          height="100%"
                        >

                          <BarChart
                            data={
                              analyticsData || []
                            }
                          >

                            <XAxis dataKey="name" />

                            <YAxis />

                            <Tooltip />

                            <Bar
                              dataKey="value"
                              fill="#06b6d4"
                              radius={[
                                10,
                                10,
                                0,
                                0,
                              ]}
                            />

                          </BarChart>

                        </ResponsiveContainer>

                      </div>

                    </div>


                    <div className="bg-slate-950 border border-slate-800 rounded-3xl p-8">

                      <h2 className="text-2xl font-bold mb-8">

                        Category Distribution

                      </h2>

                      <div className="h-[350px]">

                        <ResponsiveContainer
                          width="100%"
                          height="100%"
                        >

                          <PieChart>

                            <Pie
                              data={
                                categoryData || []
                              }
                              dataKey="value"
                              nameKey="name"
                              outerRadius={120}
                              label
                            >

                              {categoryData.map(
                                (
                                  entry,
                                  index
                                ) => (

                                  <Cell
                                    key={index}
                                    fill={
                                      pieColors[
                                        index %
                                          pieColors.length
                                      ]
                                    }
                                  />

                                )
                              )}

                            </Pie>

                            <Tooltip />

                          </PieChart>

                        </ResponsiveContainer>

                      </div>

                    </div>

                  </div>


                  <div className="bg-slate-950 border border-slate-800 rounded-3xl p-8">

                    <h2 className="text-2xl font-bold mb-8">

                      Growth Analytics

                    </h2>

                    <div className="h-[350px]">

                      <ResponsiveContainer
                        width="100%"
                        height="100%"
                      >

                        <LineChart
                          data={
                            growthData || []
                          }
                        >

                          <XAxis dataKey="name" />

                          <YAxis />

                          <Tooltip />

                          <Line
                            type="monotone"
                            dataKey="likes"
                            stroke="#06b6d4"
                            strokeWidth={3}
                          />

                          <Line
                            type="monotone"
                            dataKey="comments"
                            stroke="#8b5cf6"
                            strokeWidth={3}
                          />

                        </LineChart>

                      </ResponsiveContainer>

                    </div>

                  </div>

                </div>
              )}


              {/* NOTIFICATIONS */}
              {activeTab === "notifications" && (

                <div className="space-y-5">

                  {discussions.map(
                    (
                      discussion,
                      index
                    ) => (

                      <div
                        key={index}
                        className="bg-slate-950 border border-slate-800 rounded-3xl p-6 flex items-center justify-between"
                      >

                        <div>

                          <h2 className="text-xl font-bold mb-2">

                            New Discussion Posted

                          </h2>

                          <p className="text-slate-400">

                            {
                              discussion.author
                            } created "
                            {
                              discussion.title
                            }"

                          </p>

                        </div>

                        <Bell className="text-blue-400" />

                      </div>

                    )
                  )}

                </div>
              )}


              {/* REPORTS */}
              {activeTab === "reports" && (

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                  <div className="bg-slate-950 border border-slate-800 rounded-3xl p-8">

                    <div className="flex items-center gap-4 mb-6">

                      <TrendingUp className="text-green-400" />

                      <h2 className="text-2xl font-bold">

                        Top Performing Category

                      </h2>

                    </div>

                    <h1 className="text-5xl font-extrabold text-blue-400">

                      {categoryData[0]?.name || "N/A"}

                    </h1>

                  </div>


                  <div className="bg-slate-950 border border-slate-800 rounded-3xl p-8">

                    <div className="flex items-center gap-4 mb-6">

                      <Heart className="text-pink-400" />

                      <h2 className="text-2xl font-bold">

                        Most Liked Discussion

                      </h2>

                    </div>

                    <h1 className="text-2xl font-bold text-pink-400">

                      {topDiscussion}

                    </h1>

                  </div>

                </div>
              )}

            </motion.div>

          )}

        </div>

      </div>

    </div>
  );
};

export default Admin;