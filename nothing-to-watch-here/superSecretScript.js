let allOffers = [];
let allCategories = [];
let allCurrencies = [];
let searchText = '';
let selectedSort = 'default';
let selectedCategoryId = 0;

function adminEmpty(text) {
  return `<p class="admin__empty">${text}</p>`;
}

function categoryColorClass(categoryId) {
  const colorId = Number(categoryId) % 6;
  return `offers__specilization-${Number.isFinite(colorId) ? colorId : 0}`;
}

const loadOffers = () => {
  fetch('super_request.php')
    .then((res) => res.json())
    .then((res) => {
    allOffers = res.without || [];
    allCategories = res.categories || [];
    allCurrencies = res.currencies || [];

    renderWithout();
  });

};

let buildCategories = (categories, selectedId) => {
  let html = '<option value="">Choose category</option>';
  for (let i = 0; i < categories.length; i++) {
    let c = categories[i];
    html += `<option value="${c.id}" ${Number(c.id) === Number(selectedId) ? 'selected' : ''}>${c.name}</option>`;
  }
  return html;
};
let buildCurrencies = (currencies, selectedId) => {
  let html = '<option value="">Choose currency</option>';
  for (let i = 0; i < currencies.length; i++) {
    let c = currencies[i];
    html += `<option value="${c.id}" ${Number(c.id) === Number(selectedId) ? 'selected' : ''}>${c.name}</option>`;
  }
  return html;}

loadOffers();

function renderWithout() {
  const container = document.querySelector('.admin__containers_without');
  container.innerHTML = '';

  const searching = document.querySelector('.admin__panel_section-without .admin__containers_searching');

  if (searching) {
    searching.hidden = !allOffers.length;
  }

  if (!allOffers.length) {
    container.innerHTML = adminEmpty('There are no offers without response.');
    return;
  }

  const searched = allOffers.filter((offer) => {
  const text = `
    ${offer.title || ''}
    ${offer.description || ''}
    ${offer.award_desc || ''}
    ${offer.category || ''}
    ${offer.deadline || ''}
    ${offer.award || ''}
    ${offer.currency || ''}
  `.toLowerCase();
    return text.includes(searchText);
  });

  const chipMap = new Map();
  for (const offer of searched) {
    chipMap.set(Number(offer.category_id), offer.category);
  }

  if (selectedCategoryId && !chipMap.has(selectedCategoryId)) {
    selectedCategoryId = 0;
  }

  renderSearchCategories(chipMap);

  const visible = selectedCategoryId
    ? searched.filter((offer) => Number(offer.category_id) === selectedCategoryId)
    : searched;

  const sortedOffers = [...visible]; //копия visible

  if (selectedSort === 'award_asc') {
    sortedOffers.sort((a, b) => Number(a.award) - Number(b.award)); //важно в заметках
  }

  if (selectedSort === 'award_desc') {
    sortedOffers.sort((a, b) => Number(b.award) - Number(a.award));
  }

  if (sortedOffers.length > 0) viewCard(sortedOffers, allCategories, allCurrencies);
  else container.innerHTML = adminEmpty('Nothing found.');
}

function renderSearchCategories(chipMap) {
  const box = document.querySelector('.admin__search_categories');
  if (!box) return;

  box.innerHTML = '';

  const allBtn = document.createElement('button');
  allBtn.type = 'button';
  allBtn.className = selectedCategoryId === 0
    ? 'admin__search_chip admin__search_chip-active'
    : 'admin__search_chip';
  allBtn.dataset.id = '0';
  allBtn.textContent = 'All';
  box.appendChild(allBtn);

  for (const [id, name] of chipMap) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = Number(id) === selectedCategoryId
      ? `admin__search_chip admin__search_chip-active ${categoryColorClass(id)}`
      : 'admin__search_chip';
    btn.dataset.id = String(id);
    btn.textContent = name;
    box.appendChild(btn);
  }
}

viewCard = (offers_without, categories, currencies) => {
    for (let i = 0; i < offers_without.length; i++) {
        let cards = document.querySelector(`.admin__containers_without`)
        let card = document.createElement('form')
        let html = `
            <div class = "offers__container_top">
                <select class="offers__specilization admin__category admin__input admin__selector" name="category_id">
                    ${buildCategories(categories, offers_without[i]['category_id'])}
                </select>

                <input class="offers__deadline admin__deadline" name="deadline" value = "${offers_without[i]['deadline']}">
            </div>
            <div class="offers__container_texts">
                <input class="offers__container_title admin__input" name="title" value = "${offers_without[i]['title']}">
                <div class = "offers__container_texts_top">
                    <input name="award" class="offers__container_award admin__input" value = "${offers_without[i]['award']}">
                    <select class="offers__container_award_desc admin__currency admin__input admin__selector" name="currency_id">
                        ${buildCurrencies(currencies, offers_without[i]['currency_id'])}
                    </select>
                    <input name="award_desc" class = "offers__container_award_desc admin__input" value = "${offers_without[i]['award_desc']}">
                </div>
                <textarea class="offers__container_desc admin__input admin__without_description" name="description" rows="2">${offers_without[i]['description']}</textarea>
            </div>
            <div class="admin__without_actions">
                <input class = "admin__submit admin__input" name = "admin__submit" type = "submit" value = "Enter">
                <input class = "admin__cancel admin__input" type = "button" value = "Cancel">
                <button type="button" class="admin__delete" data-id="${offers_without[i]['id']}">Delete</button>
            </div>

            <input type="hidden" name="application_id" value="${offers_without[i]['id']}">
        `
        card.innerHTML = html

        initCardForm(card)

        card.method = 'post';
        card.action = 'without_update.php';
        card.classList.add('offers__container', 'admin__without_container')
        card.id = offers_without[i]['id']
    
        cards.appendChild(card)

        let categoryType = card.querySelector('.admin__category');
        if (categoryType && typeof TomSelect !== 'undefined' && !categoryType.tomselect) { //если элемент найден и на нем еще нет скрипта tomselect (библиотеки)
          const categorySelect = new TomSelect(categoryType, { create: false, maxOptions: 200 }); //сама библиотека. create не дает создавать вручную
          categorySelect.wrapper.classList.add('admin__category_ts');
        }
        let currencyType = card.querySelector('.admin__currency');
        if (currencyType && typeof TomSelect !== 'undefined' && !currencyType.tomselect) { //если элемент найден и на нем еще нет скрипта tomselect (библиотеки)
          const currencySelect = new TomSelect(currencyType, { create: false, maxOptions: 200 }); //сама библиотека. create не дает создавать вручную
          currencySelect.wrapper.classList.add('admin__currency_ts');
        }

    }
}
// LOCALSTORAGE ДЛЯ ФОРМЫ:

// 1. draftKey = уникальное имя сохранения

// 2. saveDraft() собирает fields в объект

// 3. JSON.stringify() сохраняет объект как строку

// 4. JSON.parse() достаёт строку обратно как объект

// 5. removeItem() удаляет черновик при Cancel/Submit

initCardForm = (card) =>{
    let submit = card.querySelector('.admin__submit');
    let cancel = card.querySelector('.admin__cancel');
    let description = card.querySelector('.admin__without_description');
    let fields = [...card.querySelectorAll('input[name]:not([type="hidden"]):not([type="submit"]):not([type="button"]), select[name], textarea[name]')];

    let applicationId = card.querySelector('input[name="application_id"]').value;
    let draftKey = `withoutDraft_${applicationId}`;

    let initial = {};
    fields.forEach(f => initial[f.name] = f.value);

    let savedDraft = localStorage.getItem(draftKey);

    if (savedDraft) {
        savedDraft = JSON.parse(savedDraft);

        fields.forEach(f => {
            if (savedDraft[f.name] !== undefined) {
                f.value = savedDraft[f.name];
            }
        });
    }

    function saveDraft() {
        let draft = {};
        let changed = false;

        fields.forEach(f => {
            draft[f.name] = f.value;

            if (f.value !== initial[f.name]) {
                changed = true;
            }
        });

        if (changed) {
            localStorage.setItem(draftKey, JSON.stringify(draft));
        } else {
            localStorage.removeItem(draftKey);
        }
    }

    function sync() {
    let changed = fields.some(f => f.value !== initial[f.name]);
    card.classList.toggle('admin__without_container-changed', changed);
    submit.disabled = !changed;
    cancel.disabled = !changed;
    saveDraft()
    }

    function limitDescriptionLines() {
        if (!description) return;

        const lines = description.value.split('\n');

        if (lines.length > 2) {
            description.value = lines.slice(0, 2).join('\n');
        }
    }

    if (description) {
        description.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && description.value.split('\n').length >= 2) {
                e.preventDefault();
            }
        });

        description.addEventListener('input', limitDescriptionLines);
        limitDescriptionLines();
    }

    card.addEventListener('input', sync);
    card.addEventListener('change', sync);
    sync();

    cancel.addEventListener('click', (e) => {
        e.preventDefault();
        fields.forEach(f => f.value = initial[f.name]);
        localStorage.removeItem(draftKey);
        sync();
    });
    card.addEventListener('submit', () => {
      localStorage.removeItem(draftKey);
    });
}
document.addEventListener('input', (e) => {
  const searchInput = e.target.closest('.admin__search_input');
  if (!searchInput) return;
  if (!searchInput.closest('.admin__panel_section-without')) return;

  searchText = searchInput.value.trim();
  renderWithout();
});

  document.addEventListener('click', (e) => {
    const categoryButton = e.target.closest('.admin__search_chip');
    if (categoryButton && categoryButton.closest('.admin__panel_section-without')) {
      selectedCategoryId = Number(categoryButton.dataset.id);
      renderWithout();
      return;
    }

  const filterTrigger = e.target.closest('.admin__search_sort-trigger');
  if (filterTrigger && filterTrigger.closest('.admin__panel_section-without')) {
    const divSearchOptions = filterTrigger.nextElementSibling;
    divSearchOptions.classList.toggle('admin__search_sort_options-open');
    return;
  }

  const sortButton = e.target.closest('.admin__search_sort-option');
  if (sortButton && sortButton.closest('.admin__panel_section-without')) {
    selectedSort = sortButton.dataset.sort;

    document
      .querySelectorAll('.admin__panel_section-without .admin__search_sort-option')
      .forEach((button) => button.classList.remove('admin__search_chip-active'));
    sortButton.classList.add('admin__search_chip-active');



    renderWithout();
    return;
  }

  const btn = e.target.closest('.admin__delete');
  if (!btn) return;
  if (!btn.closest('.admin__panel_section-without')) return;
  const fd = new FormData();
  fd.append('application_id', btn.dataset.id);
  fetch('offer_delete.php', { method: 'POST', body: fd })
    .then(r => r.json())
    .then(d => { if (d.ok) loadOffers(); else console.log(d.error); })
    .catch(console.error);
});

document.addEventListener('click', (e) => {

  const trigger = e.target.closest('.admin__panel_container-trigger');
  if (!trigger) return;

  const section = trigger.closest('.admin__panel_section');
  if (!section) return;

  const body = section.querySelector('.admin__section_body');
  if (!body) return;

  const isOpen = body.classList.toggle('admin__section_body-open');
  section.classList.toggle('admin__panel_section-open', isOpen);

  if (isOpen) {
    localStorage.setItem('openedAdminSection', section.dataset.section);
  } else {
    localStorage.removeItem('openedAdminSection');
  }
});

const openedAdminSection = localStorage.getItem('openedAdminSection');
if (openedAdminSection) {
  document.querySelectorAll('.admin__panel_section').forEach((section) => {
    if (section.dataset.section === openedAdminSection) {
      section.classList.add('admin__panel_section-open');
      section.querySelector('.admin__section_body')?.classList.add('admin__section_body-open');
    }
  });
}

function categoryBadge(categoryId, categoryName) {
    const colorId = Number(categoryId) % 6;

    return `
        <p class="offers__specilization offers__specilization-${colorId}">
            ${categoryName || 'No category'}
        </p>
    `;
}
