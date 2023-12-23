const Blog = require('../models/blog');

// Create a new blog post
exports.createPost = async (req, res) => {
    try {
        const { title, content, author } = req.body;

        const newBlogPost = new Blog({
            title,
            content,
            author,
        });

        const savedPost = await newBlogPost.save();
        res.json({ success: true, post: savedPost, message: 'Blog post created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to create blog post' });
    }
};

// Read all blog posts
exports.readAllPosts = async (req, res) => {
    try {
        const posts = await Blog.find().sort({ createdAt: -1 });
        res.json({ success: true, posts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to fetch blog posts' });
    }
};

// Read a specific blog post
exports.readPost = async (req, res) => {
    try {
        const postId = req.params.postId;
        const post = await Blog.findById(postId);
        
        if (!post) {
            return res.status(404).json({ success: false, message: 'Blog post not found' });
        }

        res.json({ success: true, post });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to fetch blog post' });
    }
};

// Update a blog post
exports.updatePost = async (req, res) => {
    try {
        const postId = req.params.postId;
        const { title, content } = req.body;

        const updatedPost = await Blog.findByIdAndUpdate(
            postId,
            { title, content, updatedAt: Date.now() },
            { new: true }
        );

        if (!updatedPost) {
            return res.status(404).json({ success: false, message: 'Blog post not found' });
        }

        res.json({ success: true, post: updatedPost, message: 'Blog post updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to update blog post' });
    }
};

// Delete a blog post
exports.deletePost = async (req, res) => {
    try {
        const postId = req.params.postId;
        const deletedPost = await Blog.findByIdAndDelete(postId);

        if (!deletedPost) {
            return res.status(404).json({ success: false, message: 'Blog post not found' });
        }

        res.json({ success: true, post: deletedPost, message: 'Blog post deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to delete blog post' });
    }
};
