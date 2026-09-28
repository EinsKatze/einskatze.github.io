(() => {
  const input = document.getElementById('search-input');
  const output = document.getElementById('search-results');
  if (!input || !output) return;

  let pages = null;
  const locale = document.documentElement.lang || 'en';
  const dateFormat = new Intl.DateTimeFormat(locale, { dateStyle: 'long' });

  const renderResults = () => {
    const query = input.value.trim().toLocaleLowerCase(locale);
    output.replaceChildren();
    if (!query || pages === null) return;

    const terms = query.split(/\s+/);
    const matches = pages
      .map((page) => {
        const searchable = `${page.title} ${page.summary} ${page.content}`.toLocaleLowerCase(locale);
        return { page, matches: terms.filter((term) => searchable.includes(term)).length };
      })
      .filter((result) => result.matches === terms.length)
      .slice(0, 20);

    if (!matches.length) {
      const empty = document.createElement('p');
      empty.className = 'empty-state';
      empty.textContent = locale.startsWith('de') ? 'Keine Treffer.' : 'No matching entries.';
      output.append(empty);
      return;
    }

    matches.forEach(({ page }) => {
      const row = document.createElement('article');
      row.className = 'post-row';
      const date = document.createElement('time');
      date.dateTime = page.date;
      date.textContent = dateFormat.format(new Date(`${page.date}T12:00:00`));
      const main = document.createElement('div');
      main.className = 'post-row-main';
      const heading = document.createElement('h3');
      const link = document.createElement('a');
      link.href = page.permalink;
      link.textContent = page.title;
      heading.append(link);
      const summary = document.createElement('p');
      summary.textContent = page.summary;
      main.append(heading, summary);
      row.append(date, main);
      output.append(row);
    });
  };

  input.addEventListener('input', renderResults);
  fetch(output.dataset.indexUrl)
    .then((response) => {
      if (!response.ok) throw new Error(`Search index request failed: ${response.status}`);
      return response.json();
    })
    .then((index) => {
      pages = index;
      renderResults();
    })
    .catch(() => {
      pages = [];
      const error = document.createElement('p');
      error.className = 'empty-state';
      error.textContent = locale.startsWith('de') ? 'Suchindex nicht verfügbar.' : 'Search index unavailable.';
      output.replaceChildren(error);
    });
})();
