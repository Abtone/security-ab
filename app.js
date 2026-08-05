const { cv } = window.cvData;

const byId = (id) => document.getElementById(id);

const create = (tag, className, text) => {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text) element.textContent = text;
  return element;
};

const appendList = (target, items, itemClass = "") => {
  const fragment = document.createDocumentFragment();

  items.forEach((item) => {
    const li = create("li", itemClass);
    li.textContent = item;
    fragment.appendChild(li);
  });

  target.appendChild(fragment);
};

const renderContact = () => {
  const list = byId("contact-list");
  list.innerHTML = "";

  cv.contact.forEach((item) => {
    const li = create("li");
    const label = create("span", "contact-label", item.label);
    const value = item.href ? create("a", "", item.value) : create("span", "", item.value);

    if (item.href) {
      value.href = item.href;
      if (item.href.startsWith("http")) {
        value.target = "_blank";
        value.rel = "noreferrer";
      }
    }

    li.append(label, value);
    list.appendChild(li);
  });
};

const renderExperience = () => {
  const list = byId("experience-list");
  const labels = cv.labels || {};
  list.innerHTML = "";

  cv.experience.forEach((job) => {
    const article = create("article", "timeline-item");
    const header = create("div", "item-header");
    const titleWrap = create("div");
    const title = create("h3", "", `${job.company} - ${job.role}`);
    const descriptions = Array.isArray(job.description) ? job.description : [job.description];

    titleWrap.appendChild(title);
    header.appendChild(titleWrap);
    if (job.period) header.appendChild(create("p", "period", job.period));
    article.appendChild(header);

    descriptions.forEach((text) => {
      if (text) article.appendChild(create("p", "description", text));
    });

    if (job.highlights) {
      const highlights = create("p", "highlights");
      const strong = create("strong", "", labels.highlightPrefix || "Contribuciones y logros clave: ");

      highlights.append(strong, document.createTextNode(job.highlights));
      article.appendChild(highlights);
    }

    if (job.achievements?.length) {
      const achievementsTitle = create("p", "highlights");
      const achievements = create("ul", "achievement-list");

      achievementsTitle.appendChild(create("strong", "", job.highlightTitle || labels.keyAchievements || "Logros clave:"));
      appendList(achievements, job.achievements);
      article.append(achievementsTitle, achievements);
    }

    list.appendChild(article);
  });
};

const renderEducation = () => {
  const list = byId("education-list");
  list.innerHTML = "";

  cv.education.forEach((item) => {
    const row = create("article", "compact-item");
    const content = create("div");
    const title = create("h3", "", item.title);

    content.appendChild(title);
    if (item.detail) content.appendChild(create("p", "detail", item.detail));
    row.appendChild(content);
    if (item.period) row.appendChild(create("p", "period", item.period));
    list.appendChild(row);
  });
};

const renderTechnologies = () => {
  const grid = byId("technology-grid");
  grid.innerHTML = "";

  cv.technologies.forEach((group) => {
    const section = create("section", "skill-card");
    const title = create("h3", "", group.title);
    const list = create("ul");

    appendList(list, group.items);
    section.append(title, list);
    grid.appendChild(section);
  });
};

const renderSkills = () => {
  const grid = byId("skills-grid");
  const midpoint = Math.ceil(cv.skills.length / 2);
  grid.innerHTML = "";

  [cv.skills.slice(0, midpoint), cv.skills.slice(midpoint)].forEach((column) => {
    const list = create("ul");
    appendList(list, column);
    grid.appendChild(list);
  });
};

const renderLanguages = () => {
  const list = byId("languages-list");
  list.innerHTML = "";

  cv.languages.forEach((language) => {
    const item = create("article", "language-item");
    item.append(create("h3", "", language.name), create("p", "", language.level));
    list.appendChild(item);
  });
};

const renderSuccessCases = () => {
  const list = byId("success-list");
  list.innerHTML = "";
  appendList(list, cv.successCases || []);
};

const renderProfile = () => {
  const summary = byId("profile-summary");
  const paragraphs = Array.isArray(cv.profile) ? cv.profile : [cv.profile];

  byId("profile-title").textContent = cv.profileTitle || "Perfil profesional";
  summary.innerHTML = "";
  paragraphs.forEach((text) => {
    if (text) summary.appendChild(create("p", "", text));
  });
};

const render = () => {
  document.title = cv.documentTitle || "security-amanda.blanco";
  renderProfile();
  byId("focus-list").innerHTML = "";
  appendList(byId("focus-list"), cv.focus);
  renderSuccessCases();
  renderContact();
  renderExperience();
  renderEducation();
  renderTechnologies();
  renderSkills();
  renderLanguages();
};

document.querySelector("[data-print]").addEventListener("click", () => {
  window.print();
});

render();
