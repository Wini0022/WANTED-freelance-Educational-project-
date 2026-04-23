fetch('super_request.php').then((res) => res.json()
    .then((res)=>{
        let offers_without = res['without'] || []
        let responseRows = res['responseRows'] || []
        document.querySelector(`.admin__containers_without`).innerHTML = ""
        if (offers_without.length > 0){ viewCard(offers_without)}
        else{document.querySelector(`.admin__panel_section-without`).innerHTML = "There're no offers without responses, available to redact."}
    }
    )
)
viewCard = (offers_without) => {
    for (let i = 0; i < offers_without.length; i++) {
        let cards = document.querySelector(`.admin__containers_without`)
        let card = document.createElement('form')
        let html = `
            <div class = "admin__container_info">
                <div class = "admin__container_top">
                    <input class="admin__specilization" name="category" value = "${offers_without[i]['category']}">
                    <input class="admin__deadline" name="deadline" value = "${offers_without[i]['deadline']}">
                </div>
                <div class="admin__container_texts">
                    <input class="admin__container_title" name="title" value = "${offers_without[i]['title']}">
                    <div class = "admin__container_texts_top">
                        <input name="award" class="admin__container_award" value = "${offers_without[i]['award']}">
                        <input name="award_desc" class = "admin__container_award_desc" value = "${offers_without[i]['award_desc']}">
                    </div>
                    <input class="admin__container_desc" name="description" value = "${offers_without[i]['description']}">
                </div>
                <input class = "admin__submit admin__input" name = "admin__submit" type = "submit" value = "Enter">    
                <input class = "admin__cancel admin__input" type = "button" value = "Cancel">  
                <input type="hidden" name="application_id" value="${offers_without[i]['id']}">
            </div>
        `
        card.innerHTML = html

        initCardForm(card)

        card.method = 'post';
        card.action = 'without_update.php';
        card.classList.add('admin__without_container')
        card.id = offers_without[i]['id']
    
        cards.appendChild(card)

    }
}
initCardForm = (card) =>{
        let submit = card.querySelector('.admin__submit');
        let cancel = card.querySelector('.admin__cancel');
        let fields = [...card.querySelectorAll('input[name]:not([type="hidden"]):not([type="submit"]):not([type="button"])')];

        let initial = {};
        fields.forEach(f => initial[f.name] = f.value);

        function sync() {
        let changed = fields.some(f => f.value !== initial[f.name]);
        submit.style.display = changed ? 'block' : 'none';
        cancel.style.display = changed ? 'block' : 'none';
        submit.disabled = !changed;
        cancel.disabled = !changed;
        }

        card.addEventListener('input', sync);
        card.addEventListener('change', sync);
        sync();

        cancel.addEventListener('click', (e) => {
        e.preventDefault();
        fields.forEach(f => f.value = initial[f.name]);
        sync();
        });
}