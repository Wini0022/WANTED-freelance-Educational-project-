fetch('super_request.php')
  .then((res) => res.json())
  .then((res) => {
    let offers_without = res.without || [];
    let categories = res.categories || [];
    let currencies = res.currencies || [];
    let container = document.querySelector('.admin__containers_without');

    container.innerHTML = '';
    if (offers_without.length > 0) viewCard(offers_without, categories, currencies);
    else container.innerHTML = "There're no offers without responses, available to redact.";
  });
let buildCategories = (categories, selectedId) => {
  let html = '<option value="">Choose category</option>';
  for (let i = 0; i < categories.length; i++) {
    let c = categories[i];
    html += `<option value="${c.id}" ${Number(c.id) === Number(selectedId) ? 'selected' : ''}>${c.name}</option>`;
  }
  return html;
};
let buildCurrencies = (currencies, selectedId) => {
  let html = '<option value="">Choose currency</option>';
  for (let i = 0; i < currencies.length; i++) {
    let c = currencies[i];
    html += `<option value="${c.id}" ${Number(c.id) === Number(selectedId) ? 'selected' : ''}>${c.name}</option>`;
  }
  return html;
};

viewCard = (offers_without, categories, currencies) => {
    for (let i = 0; i < offers_without.length; i++) {
        let cards = document.querySelector(`.admin__containers_without`)
        let card = document.createElement('form')
        let html = `
            <div class = "admin__container_info">
                <div class = "admin__container_top">

                    <select class="admin__category admin__input admin__selector" name="category_id">
                    ${buildCategories(categories, offers_without[i]['category_id'])}
                    </select>

                    <input class="admin__deadline" name="deadline" value = "${offers_without[i]['deadline']}">
                </div>
                <div class="admin__container_texts">
                    <input class="admin__container_title" name="title" value = "${offers_without[i]['title']}">
                    <div class = "admin__container_texts_top">
                        <input name="award" class="admin__container_award" value = "${offers_without[i]['award']}">
                        <select class="admin__currency admin__input admin__selector" name="currency_id">
                        ${buildCurrencies(currencies, offers_without[i]['currency_id'])}
                        </select>                        
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

        let categoryType = card.querySelector('.admin__category');
        if (categoryType && typeof TomSelect !== 'undefined' && !categoryType.tomselect) { //если элемент найден и на нем еще нет скрипта tomselect (библиотеки)
        new TomSelect(categoryType, { create: false, maxOptions: 200 }); //сама библиотека. create не дает создавать вручную
        }
        let currencyType = card.querySelector('.admin__currency');
        if (currencyType && typeof TomSelect !== 'undefined' && !currencyType.tomselect) { //если элемент найден и на нем еще нет скрипта tomselect (библиотеки)
        new TomSelect(currencyType, { create: false, maxOptions: 200 }); //сама библиотека. create не дает создавать вручную
        }

    }
}
initCardForm = (card) =>{
        let submit = card.querySelector('.admin__submit');
        let cancel = card.querySelector('.admin__cancel');
        let fields = [...card.querySelectorAll('input[name]:not([type="hidden"]):not([type="submit"]):not([type="button"]), select[name], textarea[name]')];


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