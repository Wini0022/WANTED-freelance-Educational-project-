document.addEventListener('DOMContentLoaded', () => {

    const trigger = document.querySelector('.admin__make_button-trigger');
    const panel = document.querySelector('.admin__make_panel');
    const closeButton = document.querySelector('.make__panel_close');
    const categorySelect = document.querySelector('.make__category');
    const currencySelect = document.querySelector('.make__currency');
    const form = document.querySelector('.make__panel_containers');

    if (!panel) return;

    panel.hidden = true;

    if (trigger) {
        trigger.addEventListener('click', () => {
        panel.hidden = false;
        });
    }

    if (closeButton) {
        closeButton.addEventListener('click', () => {
        panel.hidden = true;
        });
    }

    loadMakeSelects(categorySelect, currencySelect);

    if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const fd = new FormData(form);

        const res = await fetch('make_offer.php', {
            method: 'POST',
            body: fd
        });

        const data = await res.json();

        if (!data.ok) {
            alert(data.error || 'Create failed');
            return;
        }

        form.reset();

        if (categorySelect && categorySelect.tomselect) {
            categorySelect.tomselect.clear();
        }

        if (currencySelect && currencySelect.tomselect) {
            currencySelect.tomselect.clear();
        }

        panel.hidden = true;

        loadOffers();
    });
}
});


async function loadMakeSelects(categorySelect, currencySelect) {
  const res = await fetch('super_request.php');
  const data = await res.json();

  const categories = data.categories || [];
  const currencies = data.currencies || [];

  fillSelect(categorySelect, categories, 'Category');
  fillSelect(currencySelect, currencies, 'Currency');

  initMakeTomSelect(categorySelect, 'Category');
  initMakeTomSelect(currencySelect, 'Currency');
}

function fillSelect(select, rows, placeholder) {
  if (!select) return;

  select.innerHTML = `<option value="">${placeholder}</option>`;

  for (const row of rows) {
    const option = document.createElement('option');
    option.value = row.id;
    option.textContent = row.name;
    select.appendChild(option);
  }
}

function initMakeTomSelect(select, placeholder) {
  if (!select) return;
  if (typeof TomSelect === 'undefined') return;
  if (select.tomselect) return;

  new TomSelect(select, {
    create: false,
    maxOptions: 200,
    placeholder
  });
}