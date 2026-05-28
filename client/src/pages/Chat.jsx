import { useEffect, useRef, useState } from "react";

import { Link } from "react-router-dom";

import socket from "../socket/socket";

const Chat = () => {

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  // CURRENT USER
  const currentUser =
    user?.username ||
    user?.email?.split("@")[0] ||
    "User";

  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([]);

  // NEW STATES
  const [typing, setTyping] = useState("");

  const [onlineUsers, setOnlineUsers] = useState([]);

  const messagesEndRef = useRef(null);


  // AUTO SCROLL
  const scrollToBottom = () => {

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });

  };


  // SOCKET EVENTS
  useEffect(() => {

    // JOIN USER
    socket.emit(
      "joinUser",
      currentUser
    );


    // RECEIVE MESSAGE
    socket.on(
      "receiveMessage",
      (data) => {

        setMessages((prev) => [
          ...prev,
          data,
        ]);

      }
    );


    // TYPING
    socket.on(
      "typing",
      (data) => {

        setTyping(data);

      }
    );


    // ONLINE USERS
    socket.on(
      "onlineUsers",
      (users) => {

        setOnlineUsers(users);

      }
    );


    return () => {

      socket.off("receiveMessage");

      socket.off("typing");

      socket.off("onlineUsers");

    };

  }, []);


  // AUTO SCROLL EFFECT
  useEffect(() => {

    scrollToBottom();

  }, [messages]);


  // SEND MESSAGE
  const sendMessage = () => {

    if (!message.trim()) return;

    const messageData = {

      user: currentUser,

      text: message,

      time: new Date().toLocaleTimeString(),

    };

    socket.emit(
      "sendMessage",
      messageData
    );

    setMessage("");

    socket.emit("stopTyping");

  };


  // ENTER KEY SEND
  const handleKeyPress = (e) => {

    if (e.key === "Enter") {

      sendMessage();

    }

  };


  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">

      {/* NAVBAR */}
      <div className="bg-slate-800 p-5 flex justify-between items-center shadow-lg">

        <div>

          <h1 className="text-3xl font-bold">
            Real-Time Chat
          </h1>

          <p className="text-slate-400 text-sm">
            Community Live Messaging
          </p>

          {/* ONLINE USERS */}
          <p className="text-green-400 text-sm mt-1">

            {onlineUsers.length} User
            {onlineUsers.length > 1
              ? "s"
              : ""}
            {" "}Online

          </p>

        </div>


        <div className="flex gap-4 items-center">

          <h2 className="text-lg font-semibold">
            {currentUser}
          </h2>

          <Link
            to="/"
            className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Home
          </Link>

        </div>

      </div>


      {/* CHAT AREA */}
      <div className="flex-1 max-w-5xl w-full mx-auto p-6 flex flex-col">

        <div className="bg-slate-800 rounded-2xl shadow-xl flex-1 p-5 overflow-y-auto mb-5">

          {messages.length > 0 ? (

            messages.map((msg, index) => (

              <div
                key={index}
                className={`mb-4 flex ${
                  msg.user === currentUser
                    ? "justify-end"
                    : "justify-start"
                }`}
              >

                <div
                  className={`max-w-[70%] p-4 rounded-2xl ${
                    msg.user === currentUser
                      ? "bg-blue-600"
                      : "bg-slate-700"
                  }`}
                >

                  <div className="flex justify-between items-center mb-2 gap-5">

                    <h2 className="font-bold text-sm">
                      {msg.user}
                    </h2>

                    <span className="text-xs text-slate-200">
                      {msg.time}
                    </span>

                  </div>

                  <p className="break-words">
                    {msg.text}
                  </p>

                </div>

              </div>

            ))

          ) : (

            <div className="h-full flex items-center justify-center">

              <h2 className="text-2xl text-slate-400">
                No Messages Yet
              </h2>

            </div>

          )}


          {/* TYPING INDICATOR */}
          {typing && (

            <p className="text-slate-400 italic mb-3">
              {typing}
            </p>

          )}


          <div ref={messagesEndRef} />

        </div>


        {/* MESSAGE INPUT */}
        <div className="bg-slate-800 p-4 rounded-2xl shadow-lg flex gap-4">

          <input
            type="text"
            placeholder="Type your message..."
            value={message}

            onChange={(e) => {

              setMessage(
                e.target.value
              );

              socket.emit(
                "typing",
                currentUser
              );

              setTimeout(() => {

                socket.emit(
                  "stopTyping"
                );

              }, 1000);

            }}

            onKeyDown={handleKeyPress}

            className="flex-1 p-4 rounded-xl bg-slate-700 outline-none text-white"
          />

          <button
            onClick={sendMessage}
            className="bg-blue-600 px-8 rounded-xl hover:bg-blue-700 transition font-semibold"
          >
            Send
          </button>

        </div>

      </div>

    </div>
  );
};

export default Chat;