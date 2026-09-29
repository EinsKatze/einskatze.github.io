(() => {
  const input = document.getElementById('search-input');
  const output = document.getElementById('search-results');
  if (!input || !output) return;

  let fuse = null;
  let loadPromise = null;
  let loadFailed = false;
  let debounceTimer = null;
  const locale = document.documentElement.lang || 'en';
  const dateFormat = new Intl.DateTimeFormat(locale, { dateStyle: 'long' });
  const configured = JSON.parse(output.dataset.fuseOptions || '{}') || {};
  const options = Object.fromEntries(Object.entries(configured).map(([key, value]) => [key.toLowerCase(), value]));
  const fuseOptions = {
    isCaseSensitive: options.iscasesensitive ?? false,
    shouldSort: options.shouldsort ?? true,
    location: options.location ?? 0,
    distance: options.distance ?? 1000,
    threshold: options.threshold ?? 0.4,
    minMatchCharLength: options.minmatchcharlength ?? 1,
    keys: options.keys ?? ['title', 'permalink', 'summary', 'content', 'tags'],
  };
  const resultLimit = Number.isInteger(options.limit) ? options.limit : 20;

  const makeMessage = (message) => {
    const element = document.createElement('p');
    element.className = 'empty-state';
    element.textContent = message;
    return element;
  };

  const renderResults = () => {
    const query = input.value.trim();
    if (loadFailed) {
      output.replaceChildren(makeMessage(output.dataset.errorMessage || 'Search index unavailable.'));
      return;
    }
    if (fuse === null) {
      if (query) output.replaceChildren(makeMessage(output.dataset.loadingMessage || 'Loading search index...'));
      return;
    }
    output.replaceChildren();
    if (!query) return;

    const searchOptions = resultLimit > 0 ? { limit: resultLimit } : undefined;
    const matches = fuse.search(query, searchOptions);

    if (!matches.length) {
      output.append(makeMessage(output.dataset.emptyMessage || 'No matching entries.'));
      return;
    }

    matches.forEach(({ item: page }) => {
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

  const loadIndex = () => {
    if (loadPromise) return loadPromise;
    output.replaceChildren(makeMessage(output.dataset.loadingMessage || 'Loading search index...'));
    loadPromise = fetch(output.dataset.indexUrl)
      .then((response) => {
        if (!response.ok) throw new Error(`Search index request failed: ${response.status}`);
        return response.json();
      })
      .then((index) => {
        if (!window.Fuse) throw new Error('Fuse.js is unavailable.');
        fuse = new window.Fuse(index, fuseOptions);
        renderResults();
      })
      .catch(() => {
        loadFailed = true;
        renderResults();
      });
    return loadPromise;
  };

  input.addEventListener('focus', loadIndex, { once: true });
  input.addEventListener('input', () => {
    loadIndex();
    window.clearTimeout(debounceTimer);
    debounceTimer = window.setTimeout(renderResults, 150);
  });
})();
