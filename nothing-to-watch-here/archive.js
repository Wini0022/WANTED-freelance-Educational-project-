const archiveContainer = document.querySelector('.admin__containers_archive');
let allArchivatedRows = [];
let ArchivatedSearchText = '';
let ArchivatedSelectedSort = 'default';
let ArchivatedSelectedCategoryId = 0;

function formatAward(award) {
    const number = Number(award);

    if (!Number.isFinite(number)) {
        return award || '0';
    }

    return number.toLocaleString('en-US');
}

function currencySymbol(currency) {
    return (currency || '').replace(/\s*[\u{1F1E6}-\u{1F1FF}]{2}\s*$/u, '');
}

async function loadArchive(){
  const res = await fetch('archive_list.php');
  const data = await res.json();
  allArchivatedRows = data.archive || []
  renderArchive()
}
function renderArchive(){
    if (!archiveContainer) return;
    archiveContainer.innerHTML = '';

    const searching = document.querySelector('.admin__panel_section-archive .admin__containers_searching');

    if (searching) {
        searching.hidden = !allArchivatedRows.length;
    }

    if (!allArchivatedRows.length) {
        archiveContainer.innerHTML = adminEmpty('Archive is empty.');
        return;
    }

    const searched = allArchivatedRows.filter((offer) => {
        const text = `
        ${offer.title || ''}
        ${offer.application_description || ''}
        ${offer.award_desc || ''}
        ${offer.category_name || ''}
        ${offer.deadline || ''}
        ${offer.award || ''}
        ${offer.currency_name || ''}
        ${offer.nickname || ''}
        ${offer.user_desc || ''}
        ${offer.experience_months || ''}
        `.toLowerCase();

        return text.includes(ArchivatedSearchText);
    });

    const chipMap = new Map();

    for (const offer of searched) {
        chipMap.set(Number(offer.category_id), offer.category_name);
    }

    if (ArchivatedSelectedCategoryId && !chipMap.has(ArchivatedSelectedCategoryId)) {
        ArchivatedSelectedCategoryId = 0;
    }

    renderArchivatedCategories(chipMap);

    const visible = ArchivatedSelectedCategoryId
    ? searched.filter((offer) => Number(offer.category_id) === ArchivatedSelectedCategoryId)
    : searched;

    const sorted = [...visible];

    if (ArchivatedSelectedSort === 'award_asc') {
        sorted.sort((a, b) => Number(a.award) - Number(b.award));
    }

    if (ArchivatedSelectedSort === 'award_desc') {
        sorted.sort((a, b) => Number(b.award) - Number(a.award));
    }

    if (!sorted.length) {
        archiveContainer.innerHTML = adminEmpty('No archived offers match your search.');
        return;
    }
    for (const a of sorted) {
        const card = document.createElement('div')
        const html = `
        
        <div class="offers__container_top">
            <p class="offers__deadline admin__archive_days">Days left: ${a.days_left} дн.</p>
            ${categoryBadge(a.category_id, a.category_name)}
        </div>
        <div class="offers__container_texts">
            <h3 class="offers__container_title">${a.title}</h3>
            <div class="offers__container_texts_top">
                <h3 class="offers__container_award">${formatAward(a.award)}</h3>
                <p class="offers__container_award_desc">${currencySymbol(a.currency_name)}</p>
                <p class="offers__container_award_desc">${a.award_desc}</p>
            </div>
            <p class="offers__container_desc">${a.application_description}</p>
        </div>
        <div class="admin__archive_actions">
            <button type="button" class="archive-action-btn" data-action="republish" data-id="${a.id}">Republish</button>
            <button type="button" class="archive-action-btn" data-action="delete" data-id="${a.id}">Delete now</button>
        </div>
        `
        card.innerHTML = html
        card.classList.add('offers__container', 'admin__archive_container')
        archiveContainer.appendChild(card)
    }
}


if (archiveContainer) {

document.addEventListener('click', async (e) => {
  const btn = e.target.closest('.archive-action-btn');
  if (!btn) return;

  const action = btn.dataset.action;
  const applicationId = btn.dataset.id;

  const text = action === 'republish'
    ? 'Republish this application?'
    : 'Delete this application permanently?';

  if (!confirm(text)) return;

  const endpoint = action === 'republish'
    ? 'archive-republish.php'
    : 'archive_absolute_delete.php';

  const fd = new FormData();
  fd.append('application_id', applicationId);

  const res = await fetch(endpoint, { method: 'POST', body: fd });
  const data = await res.json();

  if (!data.ok) {
    alert(data.error || 'Action failed');
    return;
  }

  await loadArchive();
  if (action === 'republish') {
    loadOffers();
  }
});

// Все для Filter 
document.addEventListener('input', (e) => {
  const searchInput = e.target.closest('.admin__archivated_search_input');
  if (!searchInput) return;

  ArchivatedSearchText = searchInput.value.trim().toLowerCase();
  renderArchive();
});

document.addEventListener('click', async (e) => {
  const sortButton = e.target.closest('.admin__archivated_search_sort-option');

  if (sortButton && sortButton.closest('.admin__panel_section-archive')) {
    ArchivatedSelectedSort = sortButton.dataset.sort;

    document
      .querySelectorAll('.admin__panel_section-archive .admin__search_sort-option')
      .forEach((button) => button.classList.remove('admin__search_chip-active'));

    sortButton.classList.add('admin__search_chip-active');
    renderArchive();
    return;
  }

  const filterTrigger = e.target.closest('.admin__archivated_search_sort-trigger');

  if (filterTrigger && filterTrigger.closest('.admin__panel_section-archive')) {
    const divSearchOptions = filterTrigger.nextElementSibling;
    divSearchOptions.classList.toggle('admin__search_sort_options-open');
    return;
  }

  const categoryButton = e.target.closest('.admin__archivated_search_chip');

  if (categoryButton && categoryButton.closest('.admin__panel_section-archive')) {
    ArchivatedSelectedCategoryId = Number(categoryButton.dataset.id);
    renderArchive();
    return;
  }
});

}

function renderArchivatedCategories(chipMap) {
    const box = document.querySelector('.admin__archivated_search_categories');

    if (!box) return;

    box.innerHTML = '';

    const allBtn = document.createElement('button');
    allBtn.type = 'button';
    allBtn.className = ArchivatedSelectedCategoryId === 0
        ? 'admin__search_chip admin__archivated_search_chip admin__search_chip-active'
        : 'admin__search_chip admin__archivated_search_chip';
    allBtn.dataset.id = '0';
    allBtn.textContent = 'All';
    box.appendChild(allBtn);

    for (const [id, name] of chipMap) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = Number(id) === ArchivatedSelectedCategoryId
            ? `admin__search_chip admin__archivated_search_chip admin__search_chip-active ${categoryColorClass(id)}`
            : 'admin__search_chip admin__archivated_search_chip';
        btn.dataset.id = String(id);
        btn.textContent = name;
        box.appendChild(btn);
    }
}

loadArchive();
