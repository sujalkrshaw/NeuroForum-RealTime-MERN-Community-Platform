const Discussion = require(
  "../models/Discussion"
);


// ==============================
// CREATE DISCUSSION
// ==============================
const createDiscussion = async (
  req,
  res
) => {

  try {

    const {
      title,
      content,
      author,
      category,
    } = req.body;


    // VALIDATION
    if (
      !title ||
      !content ||
      !author
    ) {

      return res.status(400).json({
        message:
          "Please fill all fields",
      });

    }


    // CREATE DISCUSSION
    const discussion =
      await Discussion.create({
        title,
        content,
        author,
        category,
      });


    res.status(201).json({
      message:
        "Discussion Created Successfully",
      discussion,
    });

  } catch (error) {

    res.status(500).json({
      message:
        error.message ||
        "Server Error",
    });

  }

};


// ==============================
// GET ALL DISCUSSIONS
// ==============================
const getDiscussions = async (
  req,
  res
) => {

  try {

    const discussions =
      await Discussion.find().sort({
        createdAt: -1,
      });


    res.status(200).json(
      discussions
    );

  } catch (error) {

    res.status(500).json({
      message:
        error.message ||
        "Server Error",
    });

  }

};


// ==============================
// LIKE DISCUSSION
// ==============================
const likeDiscussion = async (
  req,
  res
) => {

  try {

    const discussion =
      await Discussion.findById(
        req.params.id
      );

    if (!discussion) {

      return res.status(404).json({
        message:
          "Discussion not found",
      });

    }


    discussion.likes += 1;

    await discussion.save();


    res.status(200).json({
      message:
        "Discussion Liked",
      likes: discussion.likes,
    });

  } catch (error) {

    res.status(500).json({
      message:
        error.message ||
        "Server Error",
    });

  }

};


// ==============================
// ADD COMMENT
// ==============================
const addComment = async (
  req,
  res
) => {

  try {

    const {
      user,
      text,
    } = req.body;


    // VALIDATION
    if (!text) {

      return res.status(400).json({
        message:
          "Comment cannot be empty",
      });

    }


    const discussion =
      await Discussion.findById(
        req.params.id
      );

    if (!discussion) {

      return res.status(404).json({
        message:
          "Discussion not found",
      });

    }


    discussion.comments.push({
      user,
      text,
    });

    await discussion.save();


    res.status(200).json({
      message:
        "Comment Added Successfully",
      discussion,
    });

  } catch (error) {

    res.status(500).json({
      message:
        error.message ||
        "Server Error",
    });

  }

};


// ==============================
// DELETE DISCUSSION
// ==============================
const deleteDiscussion = async (
  req,
  res
) => {

  try {

    const discussion =
      await Discussion.findById(
        req.params.id
      );

    if (!discussion) {

      return res.status(404).json({
        message:
          "Discussion not found",
      });

    }


    await discussion.deleteOne();


    res.status(200).json({
      message:
        "Discussion Deleted Successfully",
    });

  } catch (error) {

    res.status(500).json({
      message:
        error.message ||
        "Server Error",
    });

  }

};


// ==============================
// EXPORTS
// ==============================
module.exports = {
  createDiscussion,
  getDiscussions,
  likeDiscussion,
  addComment,
  deleteDiscussion,
};