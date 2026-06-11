
let chatsSearchText = '';
let chatsSelectedSort = 'default';
let chatsSelectedCategoryId = 0;

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

(async () =>{

const res = await fetch('chat_list.php');
const data = await res.json();
const chats = data.chats || [];
const container = document.querySelector('.admin__chat_container');
container.innerHTML = '';

function renderChats(chats){
  container.innerHTML = ''

  const searched = chats.filter((offer) => {
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
      return text.includes(chatsSearchText);
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

  let grouped = {};

  for (const row of visible) {
  if (!grouped[row.application_id]) grouped[row.application_id] = { app: row, reviews: [] };
  grouped[row.application_id].reviews.push(row);
  }

  const groups = Object.values(grouped);

  if (chatsSelectedSort === 'award_asc') {
  groups.sort((a, b) => Number(a.app.award) - Number(b.app.award));
  }

  if (chatsSelectedSort === 'award_desc') {
  groups.sort((a, b) => Number(b.app.award) - Number(a.app.award));
  }

  if (groups.length === 0){
    container.innerHTML = adminEmpty("There're no chats.");
    return;
  }


  for (const group of groups) {
    const chat = group.app;
    const card = document.createElement('div');
    card.innerHTML = `
      <div>
          <div class = "offers__container_top">
              ${categoryBadge(chat.category_id, chat.category_name)}
              <p class="offers__deadline">${chat.deadline}</p>
          </div>
          <div class="offers__container_texts">
              <h3 class="offers__container_title">${chat.title}</h3>
              <div class = "offers__container_texts_top">
                  <h3 class="offers__container_award">${formatAward(chat.award)}</h3>
                  <p class = "offers__container_award_desc">${currencySymbol(chat.currency_name)}</p>                        
                  <p class = "offers__container_award_desc">${chat.award_desc}</p>
              </div>
              <p class="offers__container_desc">${chat.application_description}</p>
              <div class = "admin__chat_buttons">
                <button type="button" class="open-chat admin__chats_review_button" data-chat-id="${chat.id}">Open chat <img class="open-chat__icon" src="../images/open_chat-icon.svg" alt=""></button>
                <button type="button" class="admin__delete admin__chats_delete admin__chats_review_button" data-id="${chat.application_id}">Delete</button>
              </div>
          </div>
      </div>
    `;
    container.appendChild(card);
  }
}

renderChats(chats)

document.addEventListener('input', (e) => {
const searchInput = e.target.closest('.admin__chats_search_input');
if (!searchInput) return;

chatsSearchText = searchInput.value.trim().toLowerCase();
renderChats(chats);});


document.addEventListener('click', async (e) => {
  const btn = e.target.closest('.open-chat');
  if (btn){
    window.location.href = `chat_room.php?chat_id=${btn.dataset.chatId}`;
    return
  }


  const sortButton = e.target.closest('.admin__chats_search_sort-option');
  if (sortButton && sortButton.closest('.admin__panel_section-chats')) {
      chatsSelectedSort = sortButton.dataset.sort;

  document
    .querySelectorAll('.admin__panel_section-chats .admin__search_sort-option')
    .forEach((button) => button.classList.remove('admin__search_chip-active'));

  sortButton.classList.add('admin__search_chip-active');
      renderChats(chats);
      return;
  }

  const filterTrigger = e.target.closest('.admin__chats_search_sort-trigger');
  if (filterTrigger && filterTrigger.closest('.admin__panel_section-chats')) {
      const divSearchOptions = filterTrigger.nextElementSibling;
      divSearchOptions.classList.toggle('admin__search_sort_options-open');
      return;
  }

  const categoryButton = e.target.closest('.admin__chats_search_chip');
  if (categoryButton && categoryButton.closest('.admin__panel_section-chats')) {
      chatsSelectedCategoryId = Number(categoryButton.dataset.id);

      renderChats(chats);
      return;
  }

  const deleteButton = e.target.closest('.admin__chats_delete');
  if (deleteButton && deleteButton.closest('.admin__panel_section-chats')) {
  const fd = new FormData();
  fd.append('application_id', deleteButton.dataset.id);

  const res = await fetch('offer_delete.php', { method: 'POST', body: fd });
  const data = await res.json();

  if (data.ok) location.reload();
  else alert(data.error || 'Delete failed');
  }
});


})()


function renderChatsCategories(chipMap) {
    const box = document.querySelector('.admin__chats_search_categories');

    if (!box) return;

    box.innerHTML = '';

    const allBtn = document.createElement('button');
    allBtn.type = 'button';
    allBtn.className = chatsSelectedCategoryId === 0
        ? 'admin__search_chip admin__chats_search_chip admin__search_chip-active'
        : 'admin__search_chip admin__chats_search_chip';
    allBtn.dataset.id = '0';
    allBtn.textContent = 'All';
    box.appendChild(allBtn);

    for (const [id, name] of chipMap) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = Number(id) === chatsSelectedCategoryId
            ? 'admin__search_chip admin__chats_search_chip admin__search_chip-active'
            : 'admin__search_chip admin__chats_search_chip';
        btn.dataset.id = String(id);
        btn.textContent = name;
        box.appendChild(btn);
    }
}
