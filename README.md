# Uzair Mukadam's Dynamic Portfolio

This repository contains the code for my personal portfolio website, built with HTML, Tailwind CSS, and vanilla JavaScript.
It's designed to be a "static site" that is dynamically populated from local JSON and Markdown files, making it extremely easy to update with new projects and blog posts.

## How to Update Content

You do not need to edit `index.html`, `assets/style.css`, or `assets/main.js` to add new content.

### To Add a New Project:

1. Open the `content/projects.json` file.
2. Copy an existing project's JSON object.
3. Paste it as a new item in the array.
4. Update the `title`, `description`, `imageUrl`, `githubUrl`, and `liveUrl` fields.
5. If there is no live demo, set `liveUrl` to `null`.

### To Add a New Blog Post:

This is a two-step process:

#### 1. Create the Markdown File:

- Add a new `.md file` inside the `content/blogs/` directory (e.g., `my-new-post.md`).
- Write your blog post content in this file using Markdown.

#### 2. Update the Blog Manifest:

- Open the `content/blogs.json` file.
- Add a new JSON object to the array for your post.
- Make sure the `file` property matches the filename you just created (e.g., `"file": "my-new-post.md"`).
- Fill in the `title`, `date`, `summary`, and `imageUrl` for the post's preview card.

That's it! The JavaScript in `assets/main.js` will handle the rest, fetching your new data and rendering it on the site.