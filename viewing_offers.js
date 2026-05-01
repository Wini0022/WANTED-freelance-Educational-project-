const loadOffers = () => {
    fetch('request.php').then((res) => res.json())
    .then((res) => {
      let offers_available = res['available']
      let offers_considered = res['considered']
      document.querySelector(`.offers__available_containers`).innerHTML = ""
      document.querySelector(`.offers__available_containers`).innerHTML = ""
      if (offers_available.length > 0){ viewCard(offers_available)}
      else{document.querySelector(`.offers__available_containers`).innerHTML = "There're no avalaible offers now."}
      if (offers_considered.length > 0){ viewConsidered(offers_considered)}
    }) 
}
viewCard = (offers_available) => {
    for (let i = 0; i < offers_available.length; i++) {
        let cards = document.querySelector(`.offers__available_containers`)
        let card = document.createElement('div')
        let html = `
            <div>
                <div class = "offers__container_top">
                    <p class="offers__specilization">${offers_available[i]['category']}</p>
                </div>
                <div class="offers__container_texts">
                    <h3 class="offers__container_title">${offers_available[i]['title']}</h3>
                    <div class = "offers__container_texts_top">
                        <h3 class="offers__container_award">${offers_available[i]['award']}</h3>
                        <p class = "offers__container_award_desc">${(offers_available[i]['currency'] || '').replace(/\s*[\u{1F1E6}-\u{1F1FF}]{2}\s*$/u, '')}</p>                        
                        <p class = "offers__container_award_desc">${offers_available[i]['award_desc']}</p>
                    </div>
                    <p class="offers__container_desc">${offers_available[i]['description']}</p>
                    <button ${ !IS_AUTH ? 'disabled' : '' } class="offers__container_button offers__container_button${offers_available[i]['id']}">Claim award</button>
                </div>
            </div>
        `
        card.innerHTML = html
        card.classList.add('offers__container')
        card.id = offers_available[i]['id']
    
        cards.appendChild(card)

        let btn = card.querySelector('.offers__container_button');

        btn.addEventListener('click', () => {
        const formData = new FormData();
        formData.append('application_id', card.id);

        fetch('scary_request_system.php', {
            method: 'POST',
            body: formData
        })
            .then((res) => res.json())
            .then((data) => {
            if (data.ok == true){
                loadOffers();
            }
            })
            .catch((err) => {
            console.error(err);
            });
        });
    }

}
viewConsidered = (offers_considered) =>{
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
}}
loadOffers();