let currentMode = "Beginner";

const lessons = {
  css: {
    title: "CSS Selectors & Properties",
    intro: "CSS is used to style HTML elements using selectors and properties.",
    concepts: [
      "Selectors: element, class (.), id (#), pseudo-classes",
      "Specificity: ID > Class > Element",
      "Box Model: margin, border, padding, content",
      "Flexbox & Grid for layout"
    ],
    examples: [
      ".btn { color: white; background: blue; }",
      ".card:hover { box-shadow: 0 4px 10px #0003; }"
    ],
    tips: [
      "Use classes for reusable styling",
      "Avoid inline CSS",
      "Understand specificity for exams"
    ],
    check: "Which selector is more powerful: class or id?"
  },

  html: {
    title: "HTML Basics",
    intro: "HTML gives structure to a web page using semantic tags.",
    concepts: [
      "HTML document structure",
      "Semantic tags improve SEO",
      "Attributes add extra meaning"
    ],
    examples: [
      "<header>Website Header</header>",
      "<section><h1>Title</h1></section>"
    ],
    tips: [
      "Use semantic tags in exams",
      "One h1 per page"
    ],
    check: "Which tag is best for navigation?"
  },

  js: {
    title: "JavaScript Fundamentals",
    intro: "JavaScript adds logic and interactivity to web pages.",
    concepts: [
      "Variables: let, const",
      "Functions and events",
      "DOM manipulation"
    ],
    examples: [
      "document.querySelector('button').addEventListener('click', fn)"
    ],
    tips: [
      "Prefer const",
      "Avoid global variables"
    ],
    check: "Which keyword prevents reassignment?"
  },

  db: {
    title: "Database (SQL)",
    intro: "SQL manages data in relational databases.",
    concepts: [
      "CRUD operations",
      "Primary and Foreign keys",
      "Normalization"
    ],
    examples: [
      "SELECT * FROM users WHERE id=1;"
    ],
    tips: [
      "Always use WHERE with DELETE",
      "Index frequently used columns"
    ],
    check: "Which command is used to fetch data?"
  }
};

function loadSubject() {
  const subject = document.getElementById("subjectSelect").value;
  const data = lessons[subject];

  document.getElementById("lessonTitle").textContent = data.title;
  document.getElementById("lessonIntro").textContent = data.intro;

  document.getElementById("concepts").innerHTML =
    data.concepts.map(c => `<li>${c}</li>`).join("");

  document.getElementById("examples").innerHTML =
    data.examples.map(e => `<code>${e}</code>`).join("<br>");

  document.getElementById("tips").innerHTML =
    data.tips.map(t => `<li>${t}</li>`).join("");

  document.getElementById("check").textContent = data.check;
}

function setMode(mode) {
  currentMode = mode;
  document.getElementById("modeBadge").textContent = mode;
}

loadSubject(); // initial load
