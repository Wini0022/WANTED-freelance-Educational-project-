async function loadArchive(){
  const res = await fetch('archive_list.php');
  const data = await res.json();

    const container = document.querySelector('.admin__containers_archive');
    if (!container) return;
    container.innerHTML = '';

    const rows = data.archive || [];
    if (!rows.length) {
        container.innerHTML = 'Archive is empty';
        return;
    }
    for (let i = 0; i < rows.length; i++) {
        const card = document.createElement('div')
        const a = rows[i];

        const html = `
        
        <div class="admin__container_info">
            <div class="admin__container_top">
                <p class="admin__archive_days">Days left: ${a.days_left} дн.</p>
                <p class="admin__specilization">${a.category_name}</p>
            </div>
            <div class="admin__container_texts">
                <h3 class="admin__container_title">${a.title}</h3>
                <div class="admin__container_texts_top">
                    <h3 class="admin__container_award">${a.award}</h3>
                    <p class="admin__container_award_currency">${(a.currency_name).replace(/\s*[\u{1F1E6}-\u{1F1FF}]{2}\s*$/u, '')}</p>
                    <p class="admin__container_award_desc">${a.award_desc}</p>
                </div>
                <p class="admin__container_desc">${a.description}</p>
            </div>
            <div class="admin__archive_actions">
                <button type="button" class="archive-action-btn" data-action="republish" data-id="${a.id}">Republish</button>
                <button type="button" class="archive-action-btn" data-action="delete" data-id="${a.id}">Delete now</button>
            </div>
        </div>
        `
        card.innerHTML = html
        card.classList.add('admin__archive_container')
        container.appendChild(card)
    }
};
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
});

loadArchive();