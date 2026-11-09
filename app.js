const app = document.querySelector("#app");
const year = document.querySelector("#year");
year.textContent = new Date().getFullYear();

const posts = [
  { slug: "the-quiet-power-of-small-tools", title: "The quiet power of small tools", description: "Why the best tools often disappear into the background — and how to make software feel that way.", date: "2026-10-24", topic: "Technology", readTime: "5 min read", file: "posts/the-quiet-power-of-small-tools.md" },
  { slug: "a-personal-internet", title: "A personal internet", description: "On owning a small corner of the web, and why publishing slowly still matters.", date: "2026-10-11", topic: "Web", readTime: "4 min read", file: "posts/a-personal-internet.md" },
  { slug: "notes-from-the-edge-of-the-map", title: "Notes from the edge of the map", description: "A field guide to staying curious when the answer is not in the documentation.", date: "2026-09-28", topic: "Life & work", readTime: "6 min read", file: "posts/notes-from-the-edge-of-the-map.md" }
];

const formatDate = (value) => new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(`${value}T12:00:00`));
const safeMarkdown = (markdown) => DOMPurify.sanitize(marked.parse(markdown));
const card = (post) => `
  <a class="post-card" href="#/post/${post.slug}">
    <span class="tag">${post.topic}</span>
    <h3>${post.title}</h3>
    <p>${post.description}</p>
    <div class="post-meta">${formatDate(post.date)} &nbsp;·&nbsp; ${post.readTime}</div>
  </a>`;

function home() {
  app.innerHTML = `
    <section class="home-intro">
      <span class="eyebrow">Akeir's corner of the internet</span>
      <h1>Thoughts on tech,<br />craft &amp; <em>everything in between.</em></h1>
      <p>A growing collection of notes, observations, and things I’m learning along the way. No grand conclusions — just honest curiosity.</p>
    </section>
    <section>
      <div class="section-heading"><h2>Latest notes</h2><a href="#/archive">View all notes →</a></div>
      <div class="post-grid">${posts.slice(0, 3).map(card).join("")}</div>
    </section>
    <section class="newsletter">
      <div><h2>Keep in touch.</h2><p>Occasional notes. No noise. Delivered when there’s something worth saying.</p></div>
      <a href="mailto:hello@example.com?subject=Field%20Notes">Say hello&nbsp; →</a>
    </section>`;
}

function archive() {
  app.innerHTML = `
    <section class="archive">
      <span class="eyebrow">The library</span><h1>All notes</h1>
      ${posts.map((post) => `<a class="archive-row" href="#/post/${post.slug}"><h2>${post.title}</h2><time>${formatDate(post.date)}</time><span class="archive-tag">${post.topic}</span></a>`).join("")}
    </section>`;
}

function about() {
  app.innerHTML = `
    <section class="about">
      <span class="eyebrow">A little context</span><h1>Hello, I'm Akeir.</h1>
      <p>This is my small, independent corner of the internet — a place to write about technology, creative work, and the questions that follow me around.</p>
      <p>These notes are intentionally unhurried. They are written in Markdown, kept in a Git repository, and published without a content management system. The point is to stay close to the work.</p>
      <p>Thanks for stopping by.</p>
    </section>`;
}

async function post(slug) {
  const item = posts.find((entry) => entry.slug === slug);
  if (!item) return notFound();
  app.innerHTML = `<article class="reading-column"><a class="back-link" href="#/">← Back to notes</a><header class="article-header"><span class="post-kicker">${item.topic}</span><h1>${item.title}</h1><p class="article-dek">${item.description}</p><div class="article-meta">${formatDate(item.date)} &nbsp;·&nbsp; ${item.readTime}</div></header><div class="article-body"><p class="empty-state">Loading note…</p></div></article>`;
  try {
    const response = await fetch(item.file);
    if (!response.ok) throw new Error(`Could not load ${item.file}`);
    document.querySelector(".article-body").innerHTML = safeMarkdown(await response.text());
  } catch (error) {
    document.querySelector(".article-body").innerHTML = `<p class="error-message">This note could not be loaded. Please try again later.</p>`;
    console.error(error);
  }
}

function notFound() {
  app.innerHTML = `<section class="about"><span class="eyebrow">404</span><h1>Note not found.</h1><p>The page you’re looking for has wandered off. <a href="#/">Return home →</a></p></section>`;
}

function render() {
  const [route, value] = location.hash.slice(2).split("/");
  if (route === "post" && value) return post(value);
  if (route === "archive") return archive();
  if (route === "about") return about();
  return route && route !== "" ? notFound() : home();
}

window.addEventListener("hashchange", render);
render();
