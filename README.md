# Github Dashboard

A dashboard to look at pull requests grouped by author, based on certain filters

## Live Server

1. Start a live server `python -m SimpleHTTPServer 8081`
2. Dashboard will be live at http://localhost:8081

## Github Token

1. Create a personal token on Github https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token
2. Token should have `public_repo`, `read:org`, `read:user`, `repo:status` scopes
3. Store the personal token inside local storage at http://localhost:8081, via browser console as `localStorage.setItem("github_token", "<PERSONAL TOKEN>")`

## Query

The http://localhost:8081 supports a query parameter `q`, similar to searches supported by Github Search APIs.

An example query would look like
http://localhost:8081?q=org:hypertrace+author:skjindal93