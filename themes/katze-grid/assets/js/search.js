(() => {
  const input = document.getElementById('search-input');
  const output = document.getElementById('search-results');
  const count = document.getElementById('search-count');
  const moreButton = document.getElementById('search-more');
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
    minMatchCharLength: options.minmatchcharlength ?? 2,
    keys: options.keys ?? ['title', 'summary', 'content', 'tags'],
    includeMatches: true,
  };
  const pageSize = Number.isInteger(options.limit) && options.limit > 0 ? options.limit : 10;
  let visibleLimit = pageSize;
  let currentMatches = [];
  input.value = new URL(window.location.href).searchParams.get('q') || '';

  const makeMessage = (message) => {
    const element = document.createElement('p');
    element.className = 'empty-state';
    element.textContent = message;
    return element;
  };

  const appendHighlighted = (target, value, indices = []) => {
    let cursor = 0;
    indices.forEach(([start, end]) => {
      target.append(document.createTextNode(value.slice(cursor, start)));
      const mark = document.createElement('mark');
      mark.textContent = value.slice(start, end + 1);
      target.append(mark);
      cursor = end + 1;
    });
    target.append(document.createTextNode(value.slice(cursor)));
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
    if (!query) { if (count) count.textContent = ''; if (moreButton) moreButton.hidden = true; return; }

    currentMatches = fuse.search(query);
    const matches = currentMatches.slice(0, visibleLimit);
    if (count) { const format = currentMatches.length === 1 ? count.dataset.formatOne : count.dataset.format; count.textContent = (format || '%d results').replace('%d', currentMatches.length); }
    if (moreButton) moreButton.hidden = currentMatches.length <= visibleLimit;

    if (!matches.length) {
      output.append(makeMessage(output.dataset.emptyMessage || 'No matching entries.'));
      return;
    }

    matches.forEach(({ item: page, matches: fields = [] }) => {
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
      const titleMatch = fields.find((field) => field.key === 'title' && field.indices?.length);
      if (titleMatch) appendHighlighted(link, page.title, titleMatch.indices);
      else link.textContent = page.title;
      heading.append(link);
      const summary = document.createElement('p');
      const summaryMatch = fields.find((field) => field.key === 'summary' && field.indices?.length);
      if (summaryMatch) appendHighlighted(summary, page.summary, summaryMatch.indices);
      else summary.textContent = page.summary;
      main.append(heading, summary);
      const chips = document.createElement('div'); chips.className = 'search-chips';
      if (page.section) { const chip = document.createElement('span'); chip.textContent = page.section; chips.append(chip); }
      (page.tags || []).slice(0, 3).forEach((tag) => { const chip = document.createElement('span'); chip.textContent = `#${tag}`; chips.append(chip); });
      if (chips.childElementCount) main.append(chips);
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
    visibleLimit = pageSize;
    const url = new URL(window.location.href);
    if (input.value.trim()) url.searchParams.set('q', input.value.trim()); else url.searchParams.delete('q');
    window.history.replaceState({}, '', url);
    loadIndex();
    window.clearTimeout(debounceTimer);
    debounceTimer = window.setTimeout(renderResults, 150);
  });
  moreButton?.addEventListener('click', () => { visibleLimit += pageSize; renderResults(); });
  if (input.value) loadIndex();
  else if ('requestIdleCallback' in window) window.requestIdleCallback(loadIndex, { timeout: 2500 });
  else window.setTimeout(loadIndex, 500);
})();
