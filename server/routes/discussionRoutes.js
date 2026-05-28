const express = require("express");

const router = express.Router();

const {
  createDiscussion,
  getDiscussions,
  likeDiscussion,
  addComment,
  deleteDiscussion,
} = require(
  "../controllers/discussionController"
);


// ==============================
// CREATE DISCUSSION
// ==============================
router.post(
  "/",
  createDiscussion
);


// ==============================
// GET ALL DISCUSSIONS
// ==============================
router.get(
  "/",
  getDiscussions
);


// ==============================
// LIKE DISCUSSION
// ==============================
router.put(
  "/like/:id",
  likeDiscussion
);


// ==============================
// ADD COMMENT
// ==============================
router.post(
  "/comment/:id",
  addComment
);


// ==============================
// DELETE DISCUSSION
// ==============================
router.delete(
  "/:id",
  deleteDiscussion
);


// ==============================
// EXPORT ROUTER
// ==============================
module.exports = router;