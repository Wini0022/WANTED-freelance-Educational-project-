let allOffers = [];
let allCategories = [];
let allCurrencies = [];
let searchText = '';
let selectedSort = 'default';
let selectedCategoryId = 0;

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
  else container.innerHTML = 'Nothing found.';
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
      ? 'admin__search_chip admin__search_chip-active'
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
            <div class = "admin__container_info">
                <div class = "admin__container_top">

                    <select class="admin__category admin__input admin__selector" name="category_id">
                    ${buildCategories(categories, offers_without[i]['category_id'])}
                    </select>

                    <input class="admin__deadline" name="deadline" value = "${offers_without[i]['deadline']}">
                </div>
                <div class="admin__container_texts">
                    <input class="admin__container_title" name="title" value = "${offers_without[i]['title']}">
                    <div class = "admin__container_texts_top">
                        <input name="award" class="admin__container_award" value = "${offers_without[i]['award']}">
                        <select class="admin__currency admin__input admin__selector" name="currency_id">
                        ${buildCurrencies(currencies, offers_without[i]['currency_id'])}
                        </select>                        
                        <input name="award_desc" class = "admin__container_award_desc" value = "${offers_without[i]['award_desc']}">
                    </div>
                    <input class="admin__container_desc" name="description" value = "${offers_without[i]['description']}">
                </div>
                <input class = "admin__submit admin__input" name = "admin__submit" type = "submit" value = "Enter">    
                <input class = "admin__cancel admin__input" type = "button" value = "Cancel">  
                <button type="button" class="admin__delete" data-id="${offers_without[i]['id']}">Delete</button>

                <input type="hidden" name="application_id" value="${offers_without[i]['id']}">
            </div>
        `
        card.innerHTML = html

        initCardForm(card)

        card.method = 'post';
        card.action = 'without_update.php';
        card.classList.add('admin__without_container')
        card.id = offers_without[i]['id']
    
        cards.appendChild(card)

        let categoryType = card.querySelector('.admin__category');
        if (categoryType && typeof TomSelect !== 'undefined' && !categoryType.tomselect) { //если элемент найден и на нем еще нет скрипта tomselect (библиотеки)
        new TomSelect(categoryType, { create: false, maxOptions: 200 }); //сама библиотека. create не дает создавать вручную
        }
        let currencyType = card.querySelector('.admin__currency');
        if (currencyType && typeof TomSelect !== 'undefined' && !currencyType.tomselect) { //если элемент найден и на нем еще нет скрипта tomselect (библиотеки)
        new TomSelect(currencyType, { create: false, maxOptions: 200 }); //сама библиотека. create не дает создавать вручную
        }

    }
}
initCardForm = (card) =>{
        let submit = card.querySelector('.admin__submit');
        let cancel = card.querySelector('.admin__cancel');
        let fields = [...card.querySelectorAll('input[name]:not([type="hidden"]):not([type="submit"]):not([type="button"]), select[name], textarea[name]')];


        let initial = {};
        fields.forEach(f => initial[f.name] = f.value);

        function sync() {
        let changed = fields.some(f => f.value !== initial[f.name]);
        submit.style.display = changed ? 'block' : 'none';
        cancel.style.display = changed ? 'block' : 'none';
        submit.disabled = !changed;
        cancel.disabled = !changed;
        }

        card.addEventListener('input', sync);
        card.addEventListener('change', sync);
        sync();

        cancel.addEventListener('click', (e) => {
        e.preventDefault();
        fields.forEach(f => f.value = initial[f.name]);
        sync();
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
