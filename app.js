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

const getAtsLabels = () => {
  const isEnglish = document.documentElement.lang === "en";

  return {
    profile: isEnglish ? "Professional Profile" : "Perfil profesional",
    strengths: isEnglish ? "Core Competencies" : "Competencias principales",
    experience: isEnglish ? "Professional Experience" : "Experiencia profesional",
    success: isEnglish ? "Key Achievements / Success Cases" : "Logros / Casos de éxito",
    education: isEnglish ? "Education and Studies" : "Educación y estudios",
    certifications: isEnglish ? "Certifications" : "Certificaciones",
    technologies: isEnglish ? "Technical Skills" : "Habilidades técnicas",
    skills: isEnglish ? "Professional Skills" : "Habilidades profesionales",
    languages: isEnglish ? "Languages" : "Idiomas",
    keyAchievements: cv.labels?.keyAchievements || (isEnglish ? "Key achievements:" : "Logros clave:"),
    contributionPrefix: cv.labels?.highlightPrefix || (isEnglish ? "Key contributions and achievements: " : "Contribuciones y logros clave: "),
  };
};

const appendAtsList = (target, items) => {
  const list = create("ul");
  appendList(list, items.filter(Boolean));
  target.appendChild(list);
  return list;
};

const createAtsSection = (title) => {
  const section = create("section", "ats-section");
  section.appendChild(create("h2", "", title));
  return section;
};

const isCertification = (item) =>
  /certif|certificate|certification|certified|I27001LA|LCSPC|CSFPC|SFPC|CISSP|ICSI|CNSS|MITRE ATT&CK|TrendAI|Stellar Cyber|Advanced Cyber Threat Intelligence|B1/i.test(
    item.title
  );

const appendEducationItems = (target, items) => {
  items.forEach((item) => {
    const row = create("article", "ats-entry");
    const header = create("div", "ats-entry-header");
    const title = create("h3", "", item.title);

    header.appendChild(title);
    if (item.period) header.appendChild(create("p", "ats-period", item.period));
    row.appendChild(header);
    if (item.detail) row.appendChild(create("p", "ats-detail", item.detail));
    target.appendChild(row);
  });
};

const renderAtsResume = () => {
  const root = byId("ats-resume");
  if (!root) return;

  const labels = getAtsLabels();
  const profile = Array.isArray(cv.profile) ? cv.profile : [cv.profile];
  const education = cv.education.filter((item) => !isCertification(item));
  const certifications = cv.education.filter(isCertification);

  root.innerHTML = "";

  const header = create("header", "ats-header");
  header.append(create("h1", "", cv.name), create("p", "ats-title", cv.profileTitle));

  const contact = create("ul", "ats-contact");
  cv.contact.forEach((item) => {
    const li = create("li");
    li.append(document.createTextNode(`${item.label}: `));

    if (item.href) {
      const link = create("a", "", item.value);
      link.href = item.href;
      li.appendChild(link);
    } else {
      li.appendChild(create("span", "", item.value));
    }

    contact.appendChild(li);
  });

  header.appendChild(contact);
  root.appendChild(header);

  const profileSection = createAtsSection(labels.profile);
  profile.forEach((text) => {
    if (text) profileSection.appendChild(create("p", "", text));
  });
  root.appendChild(profileSection);

  const strengthsSection = createAtsSection(labels.strengths);
  appendAtsList(strengthsSection, cv.focus);
  root.appendChild(strengthsSection);

  const experienceSection = createAtsSection(labels.experience);
  cv.experience.forEach((job) => {
    const article = create("article", "ats-entry");
    const header = create("div", "ats-entry-header");
    const title = create("h3", "", job.role);
    const meta = [job.company, job.period].filter(Boolean).join(" | ");

    header.appendChild(title);
    if (meta) header.appendChild(create("p", "ats-period", meta));
    article.appendChild(header);

    const details = [];
    (Array.isArray(job.description) ? job.description : [job.description]).forEach((text) => {
      if (text) details.push(text);
    });
    if (job.highlights) details.push(`${labels.contributionPrefix}${job.highlights}`);
    if (details.length) appendAtsList(article, details);

    if (job.achievements?.length) {
      article.appendChild(create("p", "ats-subtitle", job.highlightTitle || labels.keyAchievements));
      appendAtsList(article, job.achievements);
    }

    experienceSection.appendChild(article);
  });
  root.appendChild(experienceSection);

  const successSection = createAtsSection(labels.success);
  appendAtsList(successSection, cv.successCases || []);
  root.appendChild(successSection);

  const educationSection = createAtsSection(labels.education);
  appendEducationItems(educationSection, education);
  root.appendChild(educationSection);

  const certificationsSection = createAtsSection(labels.certifications);
  appendEducationItems(certificationsSection, certifications);
  root.appendChild(certificationsSection);

  const technologiesSection = createAtsSection(labels.technologies);
  cv.technologies.forEach((group) => {
    const groupSection = create("section", "ats-tech-group");
    groupSection.appendChild(create("h3", "", `${group.title}:`));
    appendAtsList(groupSection, group.items);
    technologiesSection.appendChild(groupSection);
  });
  root.appendChild(technologiesSection);

  const skillsSection = createAtsSection(labels.skills);
  appendAtsList(skillsSection, cv.skills);
  root.appendChild(skillsSection);

  const languagesSection = createAtsSection(labels.languages);
  appendAtsList(
    languagesSection,
    cv.languages.map((language) => `${language.name}: ${language.level}`)
  );
  root.appendChild(languagesSection);
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
  renderAtsResume();
};

document.querySelector("[data-print]").addEventListener("click", () => {
  window.print();
});

render();
