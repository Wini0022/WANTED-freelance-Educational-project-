const doneContainer = document.querySelector('.admin__containers_done');

let allDoneRows = [];
let doneSearchText = '';
let doneSelectedSort = 'default';
let doneSelectedCategoryId = 0;

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

async function loadDone(){
    const res = await fetch('./done_list.php')
    const data = await res.json()
    

    allDoneRows = data.done || []
    renderDone()
}
function renderDone(){
    if (!doneContainer) return;
    doneContainer.innerHTML = '';

    const searching = document.querySelector('.admin__panel_section-done .admin__containers_searching');

    if (searching) {
        searching.hidden = !allDoneRows.length;
    }

    if (!allDoneRows.length) {
        doneContainer.innerHTML = adminEmpty('There are no completed offers.');
        return;
    }

    const searched = allDoneRows.filter((offer) => {
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

        return text.includes(doneSearchText);
    });

    const chipMap = new Map();

    for (const offer of searched) {
        chipMap.set(Number(offer.category_id), offer.category_name);
    }

    if (doneSelectedCategoryId && !chipMap.has(doneSelectedCategoryId)) {
        doneSelectedCategoryId = 0;
    }

    renderDoneCategories(chipMap);

    const visible = doneSelectedCategoryId
    ? searched.filter((offer) => Number(offer.category_id) === doneSelectedCategoryId)
    : searched;

    const sorted = [...visible];

    if (doneSelectedSort === 'award_asc') {
        sorted.sort((a, b) => Number(a.award) - Number(b.award));
    }

    if (doneSelectedSort === 'award_desc') {
        sorted.sort((a, b) => Number(b.award) - Number(a.award));
    }

    if (!sorted.length) {
        doneContainer.innerHTML = adminEmpty('No completed offers match your search.');
        return;
    }

    for (const a of sorted) {
        const card = document.createElement('div');
        const html = `
            
        <div class="offers__container_top">
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
            <button type="button" class="open-chat open__done_chat" data-chat-id="${a.chat_id}">Open chat <img class="open-chat__icon" src="../images/open_chat-icon.svg" alt=""></button>
            <button type="button" class="delete__action_btn" data-action="delete" data-id="${a.id}">Delete</button>
        </div>
        `
        card.innerHTML = html
        card.classList.add('offers__container', 'admin__done_container')
        doneContainer.appendChild(card)
    }

}

function renderDoneCategories(chipMap) {
  const box = document.querySelector('.admin__done_search_categories');
  if (!box) return;

  box.innerHTML = '';

  const allBtn = document.createElement('button');
  allBtn.type = 'button';
  allBtn.className = doneSelectedCategoryId === 0
    ? 'admin__search_chip admin__done_search_chip admin__search_chip-active'
    : 'admin__search_chip admin__done_search_chip';
  allBtn.dataset.id = '0';
  allBtn.textContent = 'All';
  box.appendChild(allBtn);

  for (const [id, name] of chipMap) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = Number(id) === doneSelectedCategoryId
      ? `admin__search_chip admin__done_search_chip admin__search_chip-active ${categoryColorClass(id)}`
      : 'admin__search_chip admin__done_search_chip';
    btn.dataset.id = String(id);
    btn.textContent = name;
    box.appendChild(btn);
  }
}
// Кнопка чата
if (doneContainer) {

doneContainer.addEventListener('click', async (e) => {
  const openBtn = e.target.closest('.open__done_chat');
  if (openBtn) {
    window.location.href = `chat_room.php?chat_id=${openBtn.dataset.chatId}`;
    return;
  }

  const delBtn = e.target.closest('.delete__action_btn');
  if (!delBtn) return;

  if (!confirm('Move this done offer to archive?')) return;

  const fd = new FormData();
  fd.append('application_id', delBtn.dataset.id);

  const res = await fetch('offer_delete.php', { method: 'POST', body: fd });
  const data = await res.json();

  if (!data.ok) {
    alert(data.error || 'Delete failed');
    return;
  }

    await loadDone();
    await loadArchive();
});

// Все для Filter 
document.addEventListener('input', (e) => {
  const searchInput = e.target.closest('.admin__done_search_input');
  if (!searchInput) return;

  doneSearchText = searchInput.value.trim().toLowerCase();
    renderDone();
});

document.addEventListener('click', async (e) => {
  const sortButton = e.target.closest('.admin__done_search_sort-option');

  if (sortButton && sortButton.closest('.admin__panel_section-done')) {
    doneSelectedSort = sortButton.dataset.sort;

    document
      .querySelectorAll('.admin__panel_section-done .admin__search_sort-option')
      .forEach((button) => button.classList.remove('admin__search_chip-active'));

    sortButton.classList.add('admin__search_chip-active');
    renderDone();
    return;
  }

  const filterTrigger = e.target.closest('.admin__done_search_sort-trigger');

  if (filterTrigger && filterTrigger.closest('.admin__panel_section-done')) {
    const divSearchOptions = filterTrigger.nextElementSibling;
    divSearchOptions.classList.toggle('admin__search_sort_options-open');
    return;
  }

  const categoryButton = e.target.closest('.admin__done_search_chip');

  if (categoryButton && categoryButton.closest('.admin__panel_section-done')) {
    doneSelectedCategoryId = Number(categoryButton.dataset.id);
    renderDone();
    return;
  }
});

}

loadDone()
