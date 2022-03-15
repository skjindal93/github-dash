import { Octokit } from "https://cdn.skypack.dev/@octokit/rest";

const octokit = new Octokit({
  auth: "github_token" in localStorage ? localStorage.getItem("github_token") : "<insert your token here>",
});

function getPullRequests() {
  octokit.rest.search
    .issuesAndPullRequests({
      q: getQuery(),
      page_size: 100,
    })
    .then((result) => {
      return {
        authors: groupByAuthor(result["data"]["items"]),
      };
    })
    .then((data) => {
      template(data);
    });
}

function getQuery() {
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });
  return params.q;
}

function groupByAuthor(pullRequests) {
  let authorToPullRequests = {};
  for (let pr of pullRequests) {
    const user = pr["user"]["login"];
    if (user in authorToPullRequests) {
      authorToPullRequests[user]["prs"].push(pr);
    } else {
      authorToPullRequests[user] = {
        author: user,
        prs: [pr],
      };
    }
  }

  return Object.values(authorToPullRequests);
}

// html
function template(json) {
  fetch("templates/dashboard.hbs")
    .then((data) => data.text())
    .then((html) => {
      const template = Handlebars.compile(html);
      document.getElementById("dashboard").innerHTML = template(json);
    });
}

partial("templates/author.hbs", "author");
partial("templates/pr.hbs", "pr");

function partial(template, alias) {
  fetch(template)
    .then((data) => data.text())
    .then((html) => Handlebars.registerPartial(alias, html));
}

// helpers
Handlebars.registerHelper("getRepository", (url) => {
  const path = new URL(url).pathname;
  const segments = path.split("/");
  return segments[1] + "/" + segments[2];
});

Handlebars.registerHelper("getPullRequest", (url) => {
  const path = new URL(url).pathname;
  const segments = path.split("/");
  return segments[4];
});

Handlebars.registerHelper("formatDate", (date) => {
  return new Date(date).toLocaleDateString("en-us", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
});

getPullRequests();