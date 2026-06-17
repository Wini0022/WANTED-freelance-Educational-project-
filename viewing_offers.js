let allAvailable = [];
let availableSearchText = '';
let availableSelectedSort = 'default';
let availableSelectedCategoryId = 0;

let allConsidered = [];
let consideredSearchText = '';
let consideredSelectedSort = 'default';
let consideredSelectedCategoryId = 0;

let allChats = [];
let chatsSearchText = '';
let chatsSelectedSort = 'default';
let chatsSelectedCategoryId = 0;

let allDone = [];
let doneSearchText = '';
let doneSelectedSort = 'default';
let doneSelectedCategoryId = 0;

function offerEmpty(text) {
    return `<p class="offers__empty">${text}</p>`;
}

function currencySymbol(currency) {
    return (currency || '').replace(/\s*[\u{1F1E6}-\u{1F1FF}]{2}\s*$/u, '');
}

const loadOffers = () => {
  fetch('request.php')
    .then((res) => res.json())
    .then((res) => {
        allAvailable = res.available || [];
        allConsidered = res.considered || [];
        allChats = res.chats || [];
        allDone = res.done || [];
        renderAvailable();
        renderConsidered();
        renderChats();
        renderDone();
    });
};

function renderAvailable() {
    const container = document.querySelector('.offers__available_containers');
    if (!container) return;

    const searching = document.querySelector('.offers__available .offers__containers_searching');

    if (searching) {
        searching.hidden = !allAvailable.length;
    }

    if (!allAvailable.length) {
        container.innerHTML = offerEmpty("There're no available offers now.");
        return;
    }

  container.innerHTML = '';

    const searched = allAvailable.filter((offer) => {
        return getOfferSearchText(offer).includes(availableSearchText);
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

    const sorted = sortOffers(visible, availableSelectedSort);

    if (availableSelectedSort === 'award_asc') {
        sorted.sort((a, b) => Number(a.award) - Number(b.award));
    }

    if (availableSelectedSort === 'award_desc') {
        sorted.sort((a, b) => Number(b.award) - Number(a.award));
    }

    if (!sorted.length) {
        container.innerHTML = offerEmpty('No available offers match your search.');
        return;
    }

    for (const offer of sorted) {
        const card = document.createElement('div');

        card.innerHTML = `
            <div class = "offers__container_top">
                ${categoryBadge(offer.category_id, offer.category)}
                <p class="offers__deadline">${offer.deadline}</p>
            </div>
            <div class="offers__container_texts">
                <h3 class="offers__container_title">${offer.title}</h3>
                <div class="offers__container_texts_top">
                    <h3 class="offers__container_award">${formatAward(offer.award)}</h3>
                    <p class="offers__container_award_desc">${currencySymbol(offer.currency)}</p>
                    <p class="offers__container_award_desc">${offer.award_desc}</p>
                </div>
                <p class="offers__container_desc">${offer.description}</p>
                <button ${!IS_AUTH ? 'disabled' : ''} class="offers__container_button">Claim award</button>
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
  const boxes = document.querySelectorAll('.offers__available_search_categories');
  if (!boxes.length) return;

  boxes.forEach((box) => {
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
        ? `offers__search_chip offers__available_search_chip offers__search_chip-active ${categoryColorClass(id)}`
        : 'offers__search_chip offers__available_search_chip';
      btn.dataset.id = String(id);
      btn.textContent = name || 'No category';
      box.appendChild(btn);
    }
  });
}
function renderConsidered() {

    const container = document.querySelector('.offers__considered_containers');
    if (!container) return;

    const searching = document.querySelector('.offers__considered .offers__containers_searching');

    if (searching) {
        searching.hidden = !allConsidered.length;
    }

    if (!allConsidered.length) {
        container.innerHTML = offerEmpty("There're no considered offers now.");
        return;
    }

    container.innerHTML = '';

    const searched = allConsidered.filter((offer) => {
        return getOfferSearchText(offer).includes(consideredSearchText);
    });
    const chipMap = new Map();

    for (const offer of searched) {
        chipMap.set(Number(offer.category_id), offer.category);
    }

    if (consideredSelectedCategoryId && !chipMap.has(consideredSelectedCategoryId)) {
        consideredSelectedCategoryId = 0;
    }

    renderConsideredCategories(chipMap);

    const visible = consideredSelectedCategoryId
    ? searched.filter((offer) => Number(offer.category_id) === consideredSelectedCategoryId)
    : searched;

    const sorted = sortOffers(visible, consideredSelectedSort);

    if (!sorted.length) {
        container.innerHTML = offerEmpty('No considered offers match your search.');
        return;
    }
    for (const offer of sorted) {
        let card = document.createElement('div')
        let html = `
                <div class ="offers__container_top">
                    ${categoryBadge(offer.category_id, offer.category)}
                    <p class="offers__deadline">${offer.deadline}</p>
                </div>
                <div class="offers__container_texts">
                    <h3 class="offers__container_title">${offer.title}</h3>
                    <div class = "offers__container_texts_top">
                        <h3 class="offers__container_award">${formatAward(offer.award)}</h3>
                        <p class = "offers__container_award_desc">${currencySymbol(offer.currency)}</p>  
                        <p class = "offers__container_award_desc">${offer.award_desc}</p>
                    </div>
                    <p class="offers__container_desc">${offer.description}</p>
                    <div class = "offers__considered_buttons">
                        <button data-id="${offer.request_id}" class="offers__considered_refuse">Withdraw</button>
                    </div>

                </div>
        `
        card.innerHTML = html
        card.classList.add('offers__container')
        card.id = offer.id    
        container.appendChild(card)
    }
}

function renderConsideredCategories(chipMap) {
    const box = document.querySelector('.offers__considered_search_categories');
    if (!box) return;

    box.innerHTML = '';

    const allBtn = document.createElement('button');
    allBtn.type = 'button';
    allBtn.className = consideredSelectedCategoryId === 0
        ? 'offers__search_chip offers__considered_search_chip offers__search_chip-active'
        : 'offers__search_chip offers__considered_search_chip';
    allBtn.dataset.id = '0';
    allBtn.textContent = 'All';
    box.appendChild(allBtn);

    for (const [id, name] of chipMap) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = Number(id) === consideredSelectedCategoryId
        ? `offers__search_chip offers__considered_search_chip offers__search_chip-active ${categoryColorClass(id)}`
        : 'offers__search_chip offers__considered_search_chip';
        btn.dataset.id = String(id);
        btn.textContent = name || 'No category';
        box.appendChild(btn);
    }

}

function renderChats() {
    const container = document.querySelector('.offers__chats_containers');
    if (!container) return;

    const searching = document.querySelector('.offers__chats .offers__containers_searching');

    if (searching) {
        searching.hidden = !allChats.length;
    }

    if (!allChats.length) {
        container.innerHTML = offerEmpty("There're no chats now.");
        return;
    }

    container.innerHTML = '';

    const searched = allChats.filter((offer) => {
        return getOfferSearchText(offer).includes(chatsSearchText);
    });

    const chipMap = new Map();

    for (const offer of searched) {
        chipMap.set(Number(offer.category_id), offer.category_name);
    }

    if (chatsSelectedCategoryId && !chipMap.has(chatsSelectedCategoryId)) {
        chatsSelectedCategoryId = 0;
    }

    renderChatsCategories(chipMap);

    const visible = chatsSelectedCategoryId
    ? searched.filter((offer) => Number(offer.category_id) === chatsSelectedCategoryId)
    : searched;

    const sorted = sortOffers(visible, chatsSelectedSort);

    if (!sorted.length) {
        container.innerHTML = offerEmpty('No chats match your search.');
        return;
    }

    for (const offer of sorted) {
        const card = document.createElement('div');

        card.innerHTML = `
            <div class = "offers__container_top">
                ${categoryBadge(offer.category_id, offer.category_name)}
                <p class="offers__deadline">${offer.deadline}</p>
            </div>
            <div class="offers__container_texts">
                <h3 class="offers__container_title">${offer.title}</h3>
                <div class = "offers__container_texts_top">
                    <h3 class="offers__container_award">${formatAward(offer.award)}</h3>
                    <p class = "offers__container_award_desc">${currencySymbol(offer.currency_name)}</p>                        
                    <p class = "offers__container_award_desc">${offer.award_desc}</p>
                </div>
                <p class="offers__container_desc">${offer.application_description}</p>
                <div class = "offers__chat_buttons">
                    <button type="button" class="open-chat offers__chats_review_button" data-chat-id="${offer.id}">Open chat <img class="open-chat__icon" src="images/open_chat-icon.svg" alt=""></button>
                    ${Number(offer.can_withdraw) === 1 ? `<button type="button" class="offers__withdraw offers__chats_withdraw offers__chats_review_button" data-id="${offer.application_id}">Withdraw</button>`: ''}  
                </div>
            </div>
        `;

        container.appendChild(card);
    }
}

function renderChatsCategories(chipMap) {
  const box = document.querySelector('.offers__chats_search_categories');
  if (!box) return;

  box.innerHTML = '';

  const allBtn = document.createElement('button');
  allBtn.type = 'button';
  allBtn.className = chatsSelectedCategoryId === 0
    ? 'offers__search_chip offers__chats_search_chip offers__search_chip-active'
    : 'offers__search_chip offers__chats_search_chip';
  allBtn.dataset.id = '0';
  allBtn.textContent = 'All';
  box.appendChild(allBtn);

  for (const [id, name] of chipMap) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = Number(id) === chatsSelectedCategoryId
      ? `offers__search_chip offers__chats_search_chip offers__search_chip-active ${categoryColorClass(id)}`
      : 'offers__search_chip offers__chats_search_chip';
    btn.dataset.id = String(id);
    btn.textContent = name || 'No category';
    box.appendChild(btn);
  }

}

function renderDone() {
    const container = document.querySelector('.offers__done_containers');
    if (!container) return;

    const searching = document.querySelector('.offers__done .offers__containers_searching');

    if (searching) {
        searching.hidden = !allDone.length;
    }

    if (!allDone.length) {
        container.innerHTML = offerEmpty("There're no done offers now.");
        return;
    }

    container.innerHTML = '';

    const searched = allDone.filter((offer) => {
        return getOfferSearchText(offer).includes(doneSearchText);
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

    const sorted = sortOffers(visible, doneSelectedSort);

    if (!sorted.length) {
        container.innerHTML = offerEmpty('No done offers match your search.');
        return;
    }

    for (const offer of sorted) {
        const card = document.createElement('div');

        card.innerHTML = `
            <div class = "offers__container_top">
                ${categoryBadge(offer.category_id, offer.category_name)}
                <p class="offers__deadline">${offer.deadline}</p>
            </div>
            <div class="offers__container_texts">
                <h3 class="offers__container_title">${offer.title}</h3>
                <div class = "offers__container_texts_top">
                    <h3 class="offers__container_award">${formatAward(offer.award)}</h3>
                    <p class = "offers__container_award_desc">${currencySymbol(offer.currency_name)}</p>
                    <p class = "offers__container_award_desc">${offer.award_desc}</p>
                </div>
                <p class="offers__container_desc">${offer.application_description}</p>
                <div class = "offers__chat_buttons">
                    <button type="button" class="open-chat offers__done_review_button" data-chat-id="${offer.chat_id}">Open chat <img class="open-chat__icon" src="images/open_chat-icon.svg" alt=""></button>
                </div>
            </div>
        `;

        card.classList.add('offers__container');
        container.appendChild(card);
    }
}

function renderDoneCategories(chipMap) {
  const box = document.querySelector('.offers__done_search_categories');
  if (!box) return;

  box.innerHTML = '';

  const allBtn = document.createElement('button');
  allBtn.type = 'button';
  allBtn.className = doneSelectedCategoryId === 0
    ? 'offers__search_chip offers__done_search_chip offers__search_chip-active'
    : 'offers__search_chip offers__done_search_chip';
  allBtn.dataset.id = '0';
  allBtn.textContent = 'All';
  box.appendChild(allBtn);

  for (const [id, name] of chipMap) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = Number(id) === doneSelectedCategoryId
      ? `offers__search_chip offers__done_search_chip offers__search_chip-active ${categoryColorClass(id)}`
      : 'offers__search_chip offers__done_search_chip';
    btn.dataset.id = String(id);
    btn.textContent = name || 'No category';
    box.appendChild(btn);
  }

}

document.addEventListener('input', (e) => {
    const availableInput = e.target.closest('.offers__available_search_input');
    if (availableInput) {
        availableSearchText = availableInput.value.trim().toLowerCase();
        renderAvailable();
        return;
    }

    const consideredInput = e.target.closest('.offers__considered_search_input');
    if (consideredInput) {
        consideredSearchText = consideredInput.value.trim().toLowerCase();
        renderConsidered();
    }

    const chatsInput = e.target.closest('.offers__chats_search_input');
    if (chatsInput) {
        chatsSearchText = chatsInput.value.trim().toLowerCase();
        renderChats();
    }

    const doneInput = e.target.closest('.offers__done_search_input');
    if (doneInput) {
        doneSearchText = doneInput.value.trim().toLowerCase();
        renderDone();
    }
});

document.addEventListener('click', async (e) => {
    const trigger = e.target.closest('.offers__section_trigger');
    if (trigger) {
        const section = trigger.closest('.offers');
        if (section.dataset.section === 'available') return;

        const body = section.querySelector('.offers__section_body');

        body.classList.toggle('offers__section_body-open');

        if (body.classList.contains('offers__section_body-open')) {
            localStorage.setItem('openedOffersSection', section.dataset.section);
        } else {
            localStorage.removeItem('openedOffersSection');
        }

        return;
    }

    const filterTrigger = e.target.closest('.offers__available_search_sort-trigger');

    if (filterTrigger && filterTrigger.closest('.offers__available')) {
        const options = filterTrigger.nextElementSibling;
        options.classList.toggle('offers__search_sort_options-open');
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

    //considered
    const consideredFilterTrigger = e.target.closest('.offers__considered_search_sort-trigger');

    if (consideredFilterTrigger && consideredFilterTrigger.closest('.offers__considered')) {
        const options = consideredFilterTrigger.nextElementSibling;
        options.classList.toggle('offers__search_sort_options-open');
        return;
    }

    const consideredSortButton = e.target.closest('.offers__considered_search_sort-option');

    if (consideredSortButton && consideredSortButton.closest('.offers__considered')) {
        consideredSelectedSort = consideredSortButton.dataset.sort;

        document
        .querySelectorAll('.offers__considered .offers__search_sort-option')
        .forEach((button) => button.classList.remove('offers__search_chip-active'));

        consideredSortButton.classList.add('offers__search_chip-active');
        renderConsidered();
        return;
    }

    const consideredCategoryButton = e.target.closest('.offers__considered_search_chip');

    if (consideredCategoryButton && consideredCategoryButton.closest('.offers__considered')) {
        consideredSelectedCategoryId = Number(consideredCategoryButton.dataset.id);
        renderConsidered();
    }

    const refuseButton = e.target.closest('.offers__considered_refuse');

    if (refuseButton){
        const fd = new FormData();
        fd.append('request_id', refuseButton.dataset.id);

        const res = await fetch('considered_refuse.php', {
            method: 'POST',
            body: fd
        });

        const data = await res.json();

        if (data.ok) {
            loadOffers();
        }

        return;
    }

    //chat
    const btn = e.target.closest('.open-chat');
    if (btn){
        window.location.href = `nothing-to-watch-here/chat_room.php?chat_id=${btn.dataset.chatId}`;
        return
    }

    const withdrawButton = e.target.closest('.offers__chats_withdraw');
    if (withdrawButton) {
        const isConfirmed = confirm('Withdraw from this work?\n\nThe chat will be permanently deleted and the offer will become globally available again.');

        if (!isConfirmed) {
            return;
        }
        const fd = new FormData();
        fd.append('application_id', withdrawButton.dataset.id);

        const res = await fetch('withdraw_work.php', {
            method: 'POST',
            body: fd
        });

        const data = await res.json();

        if (data.ok) {
            loadOffers();
        } else {
            alert(data.error || 'Withdraw failed');
        }

        return;
    }


    const chatsFilterTrigger = e.target.closest('.offers__chats_search_sort-trigger');

    if (chatsFilterTrigger && chatsFilterTrigger.closest('.offers__chats')) {
        const options = chatsFilterTrigger.nextElementSibling;
        options.classList.toggle('offers__search_sort_options-open');
        return;
    }

    const chatsSortButton = e.target.closest('.offers__chats_search_sort-option');

    if (chatsSortButton && chatsSortButton.closest('.offers__chats')) {
        chatsSelectedSort = chatsSortButton.dataset.sort;

        document
        .querySelectorAll('.offers__chats .offers__search_sort-option')
        .forEach((button) => button.classList.remove('offers__search_chip-active'));

        chatsSortButton.classList.add('offers__search_chip-active');
        renderChats();
        return;
    }

    const chatsCategoryButton = e.target.closest('.offers__chats_search_chip');

    if (chatsCategoryButton && chatsCategoryButton.closest('.offers__chats')) {
        chatsSelectedCategoryId = Number(chatsCategoryButton.dataset.id);
        renderChats();
    }

    //done
    const doneFilterTrigger = e.target.closest('.offers__done_search_sort-trigger');

    if (doneFilterTrigger && doneFilterTrigger.closest('.offers__done')) {
        const options = doneFilterTrigger.nextElementSibling;
        options.classList.toggle('offers__search_sort_options-open');
        return;
    }

    const doneSortButton = e.target.closest('.offers__done_search_sort-option');

    if (doneSortButton && doneSortButton.closest('.offers__done')) {
        doneSelectedSort = doneSortButton.dataset.sort;

        document
        .querySelectorAll('.offers__done .offers__search_sort-option')
        .forEach((button) => button.classList.remove('offers__search_chip-active'));

        doneSortButton.classList.add('offers__search_chip-active');
        renderDone();
        return;
    }

    const doneCategoryButton = e.target.closest('.offers__done_search_chip');

    if (doneCategoryButton && doneCategoryButton.closest('.offers__done')) {
        doneSelectedCategoryId = Number(doneCategoryButton.dataset.id);
        renderDone();
    }

});

const openedSection = localStorage.getItem('openedOffersSection');

document.querySelectorAll('.offers').forEach((section) => {
    const body = section.querySelector('.offers__section_body');
    if (!body) return;

    if (section.classList.contains('offers__admin-hidden')) {
        section.classList.add('offers__section-admin-hidden');
        section.hidden = true;
        return;
    }

    if (section.dataset.section === 'available') {
        section.classList.add('offers__section-always-open');
        body.classList.add('offers__section_body-open');
        return;
    }

    if (section.dataset.section === openedSection) {
        body.classList.add('offers__section_body-open');
    } else {
        body.classList.remove('offers__section_body-open');
    }
});

function getOfferSearchText(offer) {
    return `
        ${offer.title || ''}
        ${offer.description || offer.application_description || ''}
        ${offer.category || offer.category_name || ''}
        ${offer.deadline || ''}
        ${offer.award || ''}
        ${offer.currency || offer.currency_name || ''}
        ${offer.award_desc || ''}
        ${offer.messages_text || ''}
    `.toLowerCase();
}

function sortOffers(offers, sortType) {
    const sorted = [...offers];

    if (sortType === 'award_asc') {
        sorted.sort((a, b) => Number(a.award) - Number(b.award));
    }

    if (sortType === 'award_desc') {
        sorted.sort((a, b) => Number(b.award) - Number(a.award));
    }

    return sorted;
}
loadOffers();
