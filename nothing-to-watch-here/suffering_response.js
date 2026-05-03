fetch('super_request.php')
  .then((res) => res.json())
  .then((res) => {
    let responseRows = res.responseRows || [];
    let container = document.querySelector('.admin__containers_response');
    console.log(responseRows)
    let grouped = {}

    for (const row of responseRows){
        if (!grouped[row.application_id]) grouped[row.application_id] = {app: row, reviews: []} 
        grouped[row.application_id].reviews.push(row)
    }

    const groups = Object.values(grouped);

    container.innerHTML = '';
    if (groups.length > 0) viewResponseCard(groups);
    else container.innerHTML = "There're no offers with responses.";
  });

viewResponseCard = (groups) => {
    for (let i = 0; i < groups.length; i++) {
        let cards = document.querySelector(`.admin__containers_response`)
        let card = document.createElement('div')
        let app = groups[i].app;
        let reviews = groups[i].reviews;

    let reviewsHtml = '';
    for (let r = 0; r < reviews.length; r++) {
        let row = reviews[r];

        reviewsHtml += `
        <div class="admin__review">
            <p class="admin__review_name">${row.nickname}</p>
            <p class="admin__review_exp">${row.experience_months}</p>
            <p class="admin__review_desc">${row.user_desc || 'No description'}</p>
            <p class="admin__review_number">№ ${r + 1}</p>
        </div>
        <div class = "admin__review_buttons">
                <button type="button" data-action="approve" data-request-id="${row.request_id}" class="admin__review_approve admin__review_button">Approve</button>
                <button type="button" data-action="reject" data-request-id="${row.request_id}" class="admin__review_delete admin__review_button">Reject</button>
        </div>
        `;
    }
            
    let html = `
                <div class = "admin__container_info">
                    <div class = "admin__container_top">
                        <p class="admin__specilization">${app.category_name}</p>
                    </div>
                    <div class="admin__container_texts">
                        <p class="admin__container_deadline">${app.deadline}</p>
                        <h3 class="admin__container_title">${app.title}</h3>
                        <div class = "admin__container_texts_top">
                            <h3 class="admin__container_award">${app.award}</h3>
                            <p class = "admin__container_award_currency">${app.currency_name.replace(/\s*[\u{1F1E6}-\u{1F1FF}]{2}\s*$/u, '') || '—'}</p>
                            <p class = "admin__container_award_desc">${app.award_desc}</p>
                        </div>
                        <p class="admin__container_desc">${app.description}</p>
                    </div>
                    <button type="button" class="admin__delete" data-id="${app.id}">Delete</button>

                </div>
                <div class="admin__container_reviews">
                    ${reviewsHtml}
                </div>
    `
    card.innerHTML = html
    
        cards.appendChild(card)

    }
}

document.addEventListener('click', async(e) =>{
    const btn = e.target.closest('.admin__review_button');
    if (!btn) return;
    
    const fd = new FormData()
    fd.append('request_id', btn.dataset.requestId)
    fd.append('action', btn.dataset.action)

    const res = await fetch('response_decision.php', { method: 'POST', body: fd });
    const data = await res.json();

    if (data.ok) location.reload();
    else alert(data.error || 'Action failed');
})