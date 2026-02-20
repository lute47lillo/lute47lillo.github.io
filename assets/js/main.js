async function fetchJSON(path) {
  const res = await fetch(path, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch ${path}`);
  return await res.json();
}

function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") node.className = v;
    else if (k.startsWith("on") && typeof v === "function") node.addEventListener(k.slice(2), v);
    else node.setAttribute(k, v);
  }
  for (const c of children) node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
  return node;
}

function normalize(s) {
  return (s || "").toLowerCase();
}

function renderPubs(pubs, { q = "", type = "all" } = {}) {
  const list = document.getElementById("pubList");
  list.innerHTML = "";

  const query = normalize(q);

  const filtered = pubs
    .filter(p => type === "all" ? true : normalize(p.type) === type)
    .filter(p => {
      if (!query) return true;
      const hay = normalize([
        p.title, p.venue, p.year, (p.authors || []).join(" "), (p.tags || []).join(" ")
      ].join(" "));
      return hay.includes(query);
    })
    .sort((a, b) => (b.year - a.year) || (normalize(a.title) > normalize(b.title) ? 1 : -1));

  if (filtered.length === 0) {
    list.appendChild(el("div", { class: "item" }, [
      el("div", { class: "item-title" }, ["No matching publications."])
    ]));
    return;
  }

  for (const p of filtered) {
    const title = el("div", { class: "item-title" }, [p.title]);
    const meta = el("div", { class: "item-meta" }, [
      `${(p.authors || []).join(", ")} · ${p.venue || "Venue"} · ${p.year || ""} · `,
      el("span", { class: "badge" }, [(p.type || "preprint").toUpperCase()])
    ]);

    const links = el("div", { class: "item-links" }, []);
    const linkOrder = [
      ["pdf", "PDF"],
      ["code", "Code"],
      ["project", "Project"],
      ["doi", "DOI"],
      ["arxiv", "arXiv"]
    ];

    for (const [key, label] of linkOrder) {
      if (p.links && p.links[key]) {
        links.appendChild(el("a", { class: "badge", href: p.links[key], target: "_blank", rel: "noreferrer" }, [label]));
      }
    }

    const tags = (p.tags || []).slice(0, 6).map(t => el("span", { class: "badge" }, [t]));
    const tagRow = tags.length ? el("div", { class: "item-links" }, tags) : null;

    const itemChildren = [title, meta];
    if (links.childNodes.length) itemChildren.push(links);
    if (tagRow) itemChildren.push(tagRow);

    list.appendChild(el("div", { class: "item" }, itemChildren));
  }
}

function renderProjects(projects) {
  const grid = document.getElementById("projectGrid");
  grid.innerHTML = "";

  for (const pr of projects) {
    const title = el("h3", {}, [pr.title || "Project"]);
    const desc = el("p", {}, [pr.description || "Description"]);
    const links = el("div", { class: "item-links" }, []);

    if (pr.links) {
      for (const [label, href] of Object.entries(pr.links)) {
        links.appendChild(el("a", { class: "badge", href, target: "_blank", rel: "noreferrer" }, [label]));
      }
    }

    const card = el("div", { class: "card" }, [title, desc, links]);
    grid.appendChild(card);
  }
}

function initTheme() {
  const root = document.documentElement;
  const btn = document.getElementById("themeToggle");

  const stored = localStorage.getItem("theme");
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = stored || (prefersDark ? "dark" : "light");
  root.dataset.theme = theme;

  btn.addEventListener("click", () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    localStorage.setItem("theme", next);
  });
}

async function main() {
  document.getElementById("year").textContent = new Date().getFullYear();
  initTheme();

  const [pubs, projects] = await Promise.all([
    fetchJSON("assets/data/publications.json"),
    fetchJSON("assets/data/projects.json")
  ]);

  const search = document.getElementById("pubSearch");
  const filter = document.getElementById("pubFilter");

  const rerender = () => renderPubs(pubs, { q: search.value, type: filter.value });

  search.addEventListener("input", rerender);
  filter.addEventListener("change", rerender);

  rerender();
  renderProjects(projects);
}

main().catch(err => {
  console.error(err);
  const pubList = document.getElementById("pubList");
  if (pubList) pubList.innerHTML = `<div class="item"><div class="item-title">Error loading data.</div><div class="item-meta">${err}</div></div>`;
});