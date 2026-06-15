let allResponseRows = [];
let responseSearchText = '';
let responseSelectedSort = 'default';
let responseSelectedCategoryId = 0;

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

function formatExperience(months) {
    const totalMonths = Number(months);

    if (!Number.isFinite(totalMonths) || totalMonths <= 0) {
        return 'No experience';
    }

    const years = Math.floor(totalMonths / 12);
    const restMonths = totalMonths % 12;
    const parts = [];

    if (years) {
        parts.push(`${years} ${years === 1 ? 'year' : 'years'}`);
    }

    if (restMonths) {
        parts.push(`${restMonths} ${restMonths === 1 ? 'month' : 'months'}`);
    }

    return parts.join(' ');
}

fetch('super_request.php')
  .then((res) => res.json())
  .then((res) => {
    allResponseRows = res.responseRows || [];
    renderResponses();
  });

function renderResponses() {
    const container = document.querySelector('.admin__containers_response');
    container.innerHTML = '';

    const searching = document.querySelector('.admin__panel_section-responses .admin__containers_searching');

    if (searching) {
        searching.hidden = !allResponseRows.length;
    }

    if (!allResponseRows.length) {
        container.innerHTML = adminEmpty("There're no offers with responses.");
        return;
    }

    const searched = allResponseRows.filter((offer) => {
    const text = `
        ${offer.title || ''}
        ${offer.description || ''}
        ${offer.award_desc || ''}
        ${offer.category_name || ''}
        ${offer.deadline || ''}
        ${offer.award || ''}
        ${offer.currency_name || ''}
        ${offer.message || ''}
        ${offer.nickname || ''}
        ${offer.user_desc || ''}
        ${offer.experience_months || ''}
    `.toLowerCase();
        return text.includes(responseSearchText);
    });

    const chipMap = new Map();
    for (const offer of searched) {
        chipMap.set(Number(offer.category_id), offer.category_name);
    }

    if (responseSelectedCategoryId && !chipMap.has(responseSelectedCategoryId)) {
        responseSelectedCategoryId = 0;
    }

    renderResponseCategories(chipMap);

    const visible = responseSelectedCategoryId
    ? searched.filter((offer) => Number(offer.category_id) === responseSelectedCategoryId)
    : searched;

    let grouped = {};

    for (const row of visible) {
    if (!grouped[row.application_id]) grouped[row.application_id] = { app: row, reviews: [] };
    grouped[row.application_id].reviews.push(row);
    }

    const groups = Object.values(grouped);

    if (responseSelectedSort === 'award_asc') {
    groups.sort((a, b) => Number(a.app.award) - Number(b.app.award));
    }

    if (responseSelectedSort === 'award_desc') {
    groups.sort((a, b) => Number(b.app.award) - Number(a.app.award));
    }

    if (groups.length > 0) viewResponseCard(groups);
    else container.innerHTML = adminEmpty("There're no offers with responses.");
}

function renderResponseCategories(chipMap) {
    const box = document.querySelector('.admin__response_search_categories');

    if (!box) return;

    box.innerHTML = '';

    const allBtn = document.createElement('button');
    allBtn.type = 'button';
    allBtn.className = responseSelectedCategoryId === 0
        ? 'admin__search_chip admin__response_search_chip admin__search_chip-active'
        : 'admin__search_chip admin__response_search_chip';
    allBtn.dataset.id = '0';
    allBtn.textContent = 'All';
    box.appendChild(allBtn);

    for (const [id, name] of chipMap) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = Number(id) === responseSelectedCategoryId
            ? `admin__search_chip admin__response_search_chip admin__search_chip-active ${categoryColorClass(id)}`
            : 'admin__search_chip admin__response_search_chip';
        btn.dataset.id = String(id);
        btn.textContent = name;
        box.appendChild(btn);
    }
}


viewResponseCard = (groups) => {
    for (let i = 0; i < groups.length; i++) {
        let cards = document.querySelector(`.admin__containers_response`)
        let card = document.createElement('div')
        let info = document.createElement('div')
        let reviewsContainer = document.createElement('div')
        let app = groups[i].app;
        let reviews = groups[i].reviews;

    let reviewsHtml = '';
    for (let r = 0; r < reviews.length; r++) {
        let row = reviews[r];

        reviewsHtml += `
        <div class="admin__review">
            <div class="admin__review_top">
                <div class="admin__review_person">
                    <img class="admin__review_avatar" src="../users_avatars/${row.avatar || 'user_default.png'}" alt="">
                    <div class="admin__review_person_text">
                        <p class="admin__review_name">${row.name || row.nickname}</p>
                        <p class="admin__review_exp exp_review">${formatExperience(row.experience_months)}</p>
                    </div>
                </div>
                <p class="admin__review_number">${r + 1}</p>
            </div>
            <p class="admin__review_desc">${row.message || row.user_desc || 'No message'}</p>
            <div class="admin__review_buttons">
                <button type="button" data-action="approve" data-request-id="${row.request_id}" class="admin__review_approve admin__review_button">Approve</button>
                <button type="button" data-action="reject" data-request-id="${row.request_id}" class="admin__review_delete admin__review_button">Reject</button>
            </div>
        </div>
        `;
    }
            
        info.classList.add('admin__container_info', 'offers__container');
        info.innerHTML = `
            <div class="offers__container_top">
                ${categoryBadge(app.category_id, app.category_name)}
                <p class="offers__deadline">${app.deadline}</p>
            </div>
            <div class="offers__container_texts">
                <h3 class="offers__container_title">${app.title}</h3>
                <div class="offers__container_texts_top">
                    <h3 class="offers__container_award">${formatAward(app.award)}</h3>
                    <p class="offers__container_award_desc">${currencySymbol(app.currency_name) || '—'}</p>
                    <p class="offers__container_award_desc">${app.award_desc}</p>
                </div>
                <p class="offers__container_desc">${app.description}</p>
                <div class="admin__response_actions">
                    <button type="button" class="admin__delete admin__response_delete" data-id="${app.id}">Delete</button>
                </div>
            </div>
        `;

        reviewsContainer.classList.add('admin__container_reviews');
        reviewsContainer.innerHTML = `
            ${reviewsHtml}
        `;

        card.classList.add('admin__response_container')
        card.appendChild(info)
        card.appendChild(reviewsContainer)
        cards.appendChild(card)

    }
}
document.addEventListener('input', (e) => {
const searchInput = e.target.closest('.admin__response_search_input');
if (!searchInput) return;

responseSearchText = searchInput.value.trim().toLowerCase();
renderResponses();});

document.addEventListener('click', async(e) =>{

    const sortButton = e.target.closest('.admin__response_search_sort-option');
    if (sortButton && sortButton.closest('.admin__panel_section-responses')) {
        responseSelectedSort = sortButton.dataset.sort;

    document
      .querySelectorAll('.admin__panel_section-responses .admin__search_sort-option')
      .forEach((button) => button.classList.remove('admin__search_chip-active'));

    sortButton.classList.add('admin__search_chip-active');
        renderResponses();
        return;
    }

    const filterTrigger = e.target.closest('.admin__response_search_sort-trigger');
    if (filterTrigger && filterTrigger.closest('.admin__panel_section-responses')) {
        const divSearchOptions = filterTrigger.nextElementSibling;
        divSearchOptions.classList.toggle('admin__search_sort_options-open');
        return;
    }

    const categoryButton = e.target.closest('.admin__response_search_chip');
    if (categoryButton && categoryButton.closest('.admin__panel_section-responses')) {
        responseSelectedCategoryId = Number(categoryButton.dataset.id);

        renderResponses();
        return;
    }

    const btn = e.target.closest('.admin__review_button');
    const deleteButton = e.target.closest('.admin__response_delete');
    if (deleteButton && deleteButton.closest('.admin__panel_section-responses')) {
    const fd = new FormData();
    fd.append('application_id', deleteButton.dataset.id);

    const res = await fetch('offer_delete.php', { method: 'POST', body: fd });
    const data = await res.json();

    if (data.ok) location.reload();
    else alert(data.error || 'Delete failed');

    return;
    }
    if (!btn) return;

    const fd = new FormData()
    fd.append('request_id', btn.dataset.requestId)
    fd.append('action', btn.dataset.action)

    const res = await fetch('response_decision.php', { method: 'POST', body: fd });
    const data = await res.json();

    if (data.ok) location.reload();
    else alert(data.error || 'Action failed');
})
