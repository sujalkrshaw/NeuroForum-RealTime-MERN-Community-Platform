const mongoose = require("mongoose");

const discussionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    content: {
      type: String,
      required: true,
    },

    author: {
      type: String,
      required: true,
    },

    // CATEGORY
    category: {
      type: String,
      default: "General",
    },

    // LIKES
    likes: {
      type: Number,
      default: 0,
    },

    // COMMENTS
    comments: [
      {
        user: String,

        text: String,

        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Discussion",
  discussionSchema
);