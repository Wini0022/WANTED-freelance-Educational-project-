(async () =>{

const res = await fetch('chat_list.php');
const data = await res.json();
const chats = data.chats || [];
const container = document.querySelector('.admin__chat_container');
container.innerHTML = '';

for (const chat of chats) {
  const card = document.createElement('div');
  card.innerHTML = `
    <div>
        <div class = "offers__container_top">
            <p class="offers__specilization">${chat.category_name}</p>
        </div>
        <div class="offers__container_texts">
            <h3 class="offers__container_title">${chat.title}</h3>
            <div class = "offers__container_texts_top">
                <h3 class="offers__container_award">${chat.award}</h3>
                <p class = "offers__container_award_desc">${(chat.currency_name || '').replace(/\s*[\u{1F1E6}-\u{1F1FF}]{2}\s*$/u, '')}</p>                        
                <p class = "offers__container_award_desc">${chat.award_desc}</p>
            </div>
            <p class="offers__container_desc">${chat.application_description}</p>
            <button type="button" class="open-chat" data-chat-id="${chat.id}">Open chat</button>
        </div>
    </div>
  `;
  container.appendChild(card);
}

container.addEventListener('click', (e) => {
  const btn = e.target.closest('.open-chat');
  if (!btn) return;
  window.location.href = `chat_room.php?chat_id=${btn.dataset.chatId}`;
});


})()


