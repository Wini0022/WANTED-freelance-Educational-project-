let offer = []
fetch('request.php').then((res) => res.json())
    .then((res) => {
      offer = res
      viewCard(offer)
    }) 
viewCard = (offer) => {
let items_available = offer.filter((el) => el['status'] == 0 || el['status'] == 1);
    console.log(items_available)
    for (let i = 0; i < items_available.length; i++) {
        let cards = document.querySelector(`.offers__available_containers`)
        let card = document.createElement('div')
        let html = `
            <div>
                <div class = "offers__container_top">
                    <p class="offers__specilization">${items_available[i]['category']}</p>
                </div>
                <div class="offers__container_texts">
                    <h3 class="offers__container_title">${items_available[i]['title']}</h3>
                    <div class = "offers__container_texts_top">
                        <h3 class="offers__container_award">${items_available[i]['award']}</h3>
                        <p class = "offers__container_award_desc">${items_available[i]['award_desc']}</p>
                    </div>
                    <p class="offers__container_desc">${items_available[i]['description']}</p>
                    <button ${ !IS_AUTH ? 'disabled' : '' } class="offers__container_button offers__container_button${items_available[i]['id']}">Claim award</button>
                </div>
            </div>
        `
        card.innerHTML = html
        card.classList.add('offers__container')
        card.id = items_available[i]['id']
    
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
            console.log(data);
            })
            .catch((err) => {
            console.error(err);
            });
        });

        
    }
}