Blog App Documentation
Overview
The Blog App is a versatile Blogging Platform built using Node.js, Express.js, and MongoDB. This API supports user authentication and provides CRUD operations for managing blog posts.

Authentication Endpoints


Sign Up
Endpoint: POST /api/v1/signup
Description: Allows users to register and create an account.
Request Body (JSON):
json
{
    "name": "satyam",
    "email": "sk12@gmaail.com",
    "password": "123456",
    "role": "User"
}



LogIn
Endpoint: POST /api/v1/login
Description: Enables users to log in with their registered credentials.
Request Body (JSON):
json
{
    "email": "sk12@gmaail.com",
    "password": "123456"
}


Blog Post Endpoints:

Create Post
Endpoint: POST /api/v1/posts
Description: Allows authenticated users to create a new blog post.
Request Body (JSON):
json
{
    "title": "Example Title",
    "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    // Additional fields based on your model
}

Read All Posts
Endpoint: GET /api/v1/posts
Description: Retrieves all blog posts.
Note: Accessible to non-authenticated users.

Read a Specific Post
Endpoint: GET /api/v1/posts/:postId
Description: Retrieves a specific blog post by ID.
Note: Accessible to non-authenticated users.

Update Post
Endpoint: PUT /api/v1/posts/:postId
Description: Allows authenticated users to update a specific blog post.
Request Body (JSON):
json
{
    "title": "Updated Title",
    "content": "Updated content goes here.",
}


Delete Post
Endpoint: DELETE /api/v1/posts/:postId
Description: Allows authenticated users to delete a specific blog post.