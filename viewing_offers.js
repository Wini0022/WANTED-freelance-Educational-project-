let allAvailable = [];
let availableSearchText = '';
let availableSelectedSort = 'default';
let availableSelectedCategoryId = 0;

const loadOffers = () => {
  fetch('request.php')
    .then((res) => res.json())
    .then((res) => {
      allAvailable = res.available || [];
      renderAvailable();
    });
};

function renderAvailable() {
  const container = document.querySelector('.offers__available_containers');
  if (!container) return;

  container.innerHTML = '';

  const searched = allAvailable.filter((offer) => {
    const text = `
      ${offer.title || ''}
      ${offer.description || ''}
      ${offer.category || ''}
      ${offer.deadline || ''}
      ${offer.award || ''}
      ${offer.currency || ''}
      ${offer.award_desc || ''}
    `.toLowerCase();

    return text.includes(availableSearchText);
  });

  const chipMap = new Map();

  for (const offer of searched) {
    chipMap.set(Number(offer.category_id), offer.category);
  }

  if (availableSelectedCategoryId && !chipMap.has(availableSelectedCategoryId)) {
    availableSelectedCategoryId = 0;
  }

  renderAvailableCategories(chipMap);

  const visible = availableSelectedCategoryId
    ? searched.filter((offer) => Number(offer.category_id) === availableSelectedCategoryId)
    : searched;

  const sorted = [...visible];

  if (availableSelectedSort === 'award_asc') {
    sorted.sort((a, b) => Number(a.award) - Number(b.award));
  }

  if (availableSelectedSort === 'award_desc') {
    sorted.sort((a, b) => Number(b.award) - Number(a.award));
  }

  if (!sorted.length) {
    container.innerHTML = "There're no available offers now.";
    return;
  }

  for (const offer of sorted) {
    const card = document.createElement('div');

    card.innerHTML = `
        <div>
            <div class="offers__container_top">
                <p class="offers__specilization">${offer.category || ''}</p>
            </div>
            <div class="offers__container_texts">
                <h3 class="offers__container_title">${offer.title}</h3>
                <div class="offers__container_texts_top">
                    <h3 class="offers__container_award">${offer.award}</h3>
                    <p class="offers__container_award_desc">${(offer.currency || '').replace(/\s*[\u{1F1E6}-\u{1F1FF}]{2}\s*$/u, '')}</p>
                    <p class="offers__container_award_desc">${offer.award_desc}</p>
                </div>
                <p class="offers__container_desc">${offer.description}</p>
                <button ${!IS_AUTH ? 'disabled' : ''} class="offers__container_button">Claim award</button>
            </div>
        </div>
    `;

    card.classList.add('offers__container');
    card.id = offer.id;
    container.appendChild(card);

    const btn = card.querySelector('.offers__container_button');

    btn.addEventListener('click', () => {
      const formData = new FormData();
      formData.append('application_id', card.id);

      fetch('scary_request_system.php', {
        method: 'POST',
        body: formData
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.ok === true) {
            loadOffers();
          }
        })
        .catch(console.error);
    });
  }
}

function renderAvailableCategories(chipMap) {
  const box = document.querySelector('.offers__available_search_categories');
  if (!box) return;

  box.innerHTML = '';

  const allBtn = document.createElement('button');
  allBtn.type = 'button';
  allBtn.className = availableSelectedCategoryId === 0
    ? 'offers__search_chip offers__available_search_chip offers__search_chip-active'
    : 'offers__search_chip offers__available_search_chip';
  allBtn.dataset.id = '0';
  allBtn.textContent = 'All';
  box.appendChild(allBtn);

  for (const [id, name] of chipMap) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = Number(id) === availableSelectedCategoryId
      ? 'offers__search_chip offers__available_search_chip offers__search_chip-active'
      : 'offers__search_chip offers__available_search_chip';
    btn.dataset.id = String(id);
    btn.textContent = name || 'No category';
    box.appendChild(btn);
  }

}
/*function renderConsidered() {
  const container = document.querySelector('.offers__considered_containers');
  container.innerHTML = '';

  const searched = allConsidered.filter((offer) => {
    const text = `
      ${offer.title || ''}
      ${offer.description || ''}
      ${offer.category || ''}
      ${offer.deadline || ''}
      ${offer.award || ''}
      ${offer.currency || ''}
      ${offer.award_desc || ''}
    `.toLowerCase();

    return text.includes(consideredSearchText);
  });

  if (!searched.length) {
    container.innerHTML = "There're no considered offers now.";
    return;
  }
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
        container.innerHTML = 'Archive is empty.';
        return;
    }
  viewConsidered(searched);

/*viewConsidered = (offers_considered) =>{
    for (let i = 0; i < offers_considered.length; i++) {
        let cards = document.querySelector(`.offers__considered_containers`)
        let card = document.createElement('div')
        let html = `
            <div>
                <div class = "offers__container_top">
                    <p class="offers__specilization">${offers_considered[i]['category']}</p>
                </div>
                <div class="offers__container_texts">
                    <h3 class="offers__container_title">${offers_considered[i]['title']}</h3>
                    <div class = "offers__container_texts_top">
                        <h3 class="offers__container_award">${offers_considered[i]['award']}</h3>
                        <p class = "offers__container_award_desc">${(offers_considered[i]['currency'] || '').replace(/\s*[\u{1F1E6}-\u{1F1FF}]{2}\s*$/u, '')}</p>  
                        <p class = "offers__container_award_desc">${offers_considered[i]['award_desc']}</p>
                    </div>
                    <p class="offers__container_desc">${offers_considered[i]['description']}</p>
                    <p class = "offers__considered_text">Checking..</p>
                </div>
            </div>
        `
        card.innerHTML = html
        card.classList.add('offers__container')
        card.id = offers_considered[i]['id']
    
        cards.appendChild(card)
}}*/

document.addEventListener('input', (e) => {
  const input = e.target.closest('.offers__available_search_input');
  if (!input) return;

  availableSearchText = input.value.trim().toLowerCase();
  renderAvailable();
});

document.addEventListener('click', (e) => {
  const trigger = e.target.closest('.offers__section_trigger');
  if (trigger) {
    const section = trigger.closest('.offers');
    const body = section.querySelector('.offers__section_body');

    body.hidden = !body.hidden;

    if (body.hidden) {
      localStorage.removeItem('openedOffersSection');
    } else {
      localStorage.setItem('openedOffersSection', section.dataset.section);
    }

    return;
  }

  const filterTrigger = e.target.closest('.offers__available_search_sort-trigger');

  if (filterTrigger && filterTrigger.closest('.offers__available')) {
    const options = filterTrigger.nextElementSibling;
    options.hidden = !options.hidden;
    return;
  }

  const sortButton = e.target.closest('.offers__available_search_sort-option');

  if (sortButton && sortButton.closest('.offers__available')) {
    availableSelectedSort = sortButton.dataset.sort;

    document
      .querySelectorAll('.offers__available .offers__search_sort-option')
      .forEach((button) => button.classList.remove('offers__search_chip-active'));

    sortButton.classList.add('offers__search_chip-active');
    renderAvailable();
    return;
  }

  const categoryButton = e.target.closest('.offers__available_search_chip');

  if (categoryButton && categoryButton.closest('.offers__available')) {
    availableSelectedCategoryId = Number(categoryButton.dataset.id);
    renderAvailable();
  }
});

const openedSection = localStorage.getItem('openedOffersSection');

document.querySelectorAll('.offers').forEach((section) => {
  const body = section.querySelector('.offers__section_body');
  if (!body) return;

  body.hidden = section.dataset.section !== openedSection;
});

loadOffers();