const express = require("express");
const router = express.Router();

const { auth } = require("../middlewares/auth");
const {
    createPost,
    readAllPosts,
    readPost,
    updatePost,
    deletePost,
} = require('../Controllers/Blog');

// Create a new blog post
router.post('/posts', auth, createPost);

// Read all blog posts
router.get('/posts', readAllPosts);

// Read a specific blog post
router.get('/posts/:postId', readPost);

// Update a blog post
router.put('/posts/:postId', auth, updatePost);

// Delete a blog post
router.delete('/posts/:postId', auth, deletePost);

module.exports = router;
