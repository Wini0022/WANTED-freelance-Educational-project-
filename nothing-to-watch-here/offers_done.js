const container = document.querySelector('.admin__containers_done');
async function loadDone(){
    const res = await fetch('./done_list.php')
    const data = await res.json()
    
    if (!container) return;
    container.innerHTML = '';

    const rows = data.done || [];
    if (!rows.length) {
        container.innerHTML = 'There are no completed offers.';
        return;
    }
    for (let i = 0; i < rows.length; i++) {
        const card = document.createElement('div')
        const a = rows[i];

        const html = `
        
        <div class="admin__container_info">
            <div class="admin__container_top">
                <p class="admin__specilization">${a.category_name}</p>
            </div>
            <div class="admin__container_texts">
                <h3 class="admin__container_title">${a.title}</h3>
                <div class="admin__container_texts_top">
                    <h3 class="admin__container_award">${a.award}</h3>
                    <p class="admin__container_award_currency">${(a.currency_name || '').replace(/\s*[\u{1F1E6}-\u{1F1FF}]{2}\s*$/u, '')}</p>
                    <p class="admin__container_award_desc">${a.award_desc}</p>
                </div>
                <p class="admin__container_desc">${a.description}</p>
            </div>
            <div class="admin__archive_actions">
                <button type="button" class="open__done_chat" data-chat-id="${a.chat_id}">Open chat</button>
                <button type="button" class="delete__action_btn" data-action="delete" data-id="${a.id}">Delete</button>
            </div>
        </div>
        `
        card.innerHTML = html
        card.classList.add('admin__done_container')
        container.appendChild(card)
    }

}
container.addEventListener('click', async (e) => {
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
});
loadDone()