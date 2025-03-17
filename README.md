# Twitter Backend 🚀

Ushbu hujjat Twitter-backend loyihasining asosiy API endpointlarini tushuntiradi 📝

## /api/users 🧑‍💻

• POST /register – Register a new user.
• POST /login – Log into an existing user account.
• POST /logout – Log out and clear the authentication cookie.
• PUT /profile-picture – Upload a profile picture for the currently authenticated user.
• GET /profile-picture/:id – Retrieve a user’s profile picture by user ID.

## /api/posts ✨

• POST /create – Create a new post (optional image upload).
• GET /:id – Retrieve a single post by its ID.
• PUT /update/:id – Update an existing post (optional image upload).
• DELETE /delete/:id – Delete a post belonging to the authenticated user.
• POST /:id/like – Like a post.
• DELETE /:id/unlike – Unlike a post.
• POST /:id/bookmark – Bookmark a post.
• DELETE /:id/unbookmark – Remove bookmark from a post.
• GET /user/:userId – Retrieve all posts by a specific user.

## /api/comments 💬

• POST /create – Create a new comment under a post.
• GET /all/:postId – Retrieve all comments for a given post.
• PUT /update/:commentId – Update an existing comment of the authenticated user.
• DELETE /delete/:commentId – Delete a comment (also removes it from comment history).
• POST /:commentId/like – Like a comment.
• DELETE /:commentId/unlike – Unlike a comment.
