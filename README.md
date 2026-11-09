# Field Notes

A frontend-only, Markdown-powered blog designed for GitHub Pages.

## Adding a post

1. Add a Markdown file to `posts/`.
2. Add its metadata and file path to the `posts` array in `app.js`.
3. Publish the repository with GitHub Pages.

For local development, serve the project over HTTP (for example `python -m http.server`) because browser `fetch()` cannot load Markdown files from a `file://` URL.
