document.addEventListener('DOMContentLoaded', async () => {

    const panel = document.querySelector('.admin__make_panel');
    if (!panel) return;

    const makeTrigger = document.querySelector('.admin__make_button-trigger');
    const makeClose = document.querySelector('.make__panel_close');
    const categorySelect = document.querySelector('.make__category');
    const currencySelect = document.querySelector('.make__currency');
    const form = document.querySelector('.make__panel_containers');
    const submitButton = form.querySelector('.admin__make_submit');
    const example = form.querySelector('.make__example');

    const draftKey = 'make-offer-draft';
    const fields = form.querySelectorAll('input[name], select[name], textarea[name]');
    const descriptionInput = form.querySelector('textarea[name="description"]');
    let lastValidDescription = '';

    const savedDraft = localStorage.getItem(draftKey);

    if (savedDraft) {
        const draft = JSON.parse(savedDraft);

        fields.forEach((field) => {
            if (draft[field.name] !== undefined) {
                field.value = draft[field.name];
            }
        });
    }

    function trimDescriptionToLimit() {
        if (!descriptionInput) return;

        while (descriptionInput.scrollHeight > descriptionInput.clientHeight + 1 && descriptionInput.value.length > 0) {
            descriptionInput.value = descriptionInput.value.slice(0, -1);
        }

        lastValidDescription = descriptionInput.value;
    }

    function limitDescriptionRows() {
        if (!descriptionInput) return;

        if (descriptionInput.scrollHeight <= descriptionInput.clientHeight + 1) {
            lastValidDescription = descriptionInput.value;
            return;
        }

        descriptionInput.value = lastValidDescription;
    }

    trimDescriptionToLimit();

    function saveDraft() {
        const draft = {};

        fields.forEach((field) => {
            draft[field.name] = field.value;
        });

        localStorage.setItem(draftKey, JSON.stringify(draft));
    }

    function syncMakeSubmit() {
        if (!submitButton) return;

        const title = form.elements.title.value.trim();
        const description = form.elements.description.value.trim();
        const categoryNew = form.elements.category_new.value.trim();
        const categorySelected = categorySelect.value !== '';

        submitButton.disabled = !(title && description && (categorySelected || categoryNew));
    }

    function escapeHtml(value) {
        return String(value).replace(/[&<>"']/g, (char) => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        }[char]));
    }

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

    function selectedOptionText(select) {
        if (!select || select.value === '') return '';

        return select.selectedOptions[0]?.textContent.trim() || '';
    }

    function renderMakeExample() {
        if (!example) return;

        const title = form.elements.title.value.trim();
        const description = form.elements.description.value.trim();
        const categoryNew = form.elements.category_new.value.trim();
        const categoryName = categoryNew || selectedOptionText(categorySelect);
        const currency = selectedOptionText(currencySelect);

        if (!title || !description || !categoryName || !currency) {
            example.innerHTML = '<img class="make__example_empty" src="../images/make_example.png" alt="">';
            return;
        }

        const categoryId = categorySelect.value || 0;
        const deadline = form.elements.deadline.value.trim() || 'No deadline';
        const award = form.elements.award.value.trim() || '0';
        const awardDesc = form.elements.award_desc.value.trim() || 'Debit transfer';
        const colorId = Number(categoryId) % 6;

        example.innerHTML = `
            <div class="offers__container make__example_card">
                <div class="offers__container_top">
                    <p class="offers__specilization offers__specilization-${Number.isFinite(colorId) ? colorId : 0}">
                        ${escapeHtml(categoryName)}
                    </p>
                    <p class="offers__deadline">${escapeHtml(deadline)}</p>
                </div>
                <div class="offers__container_texts">
                    <h3 class="offers__container_title">${escapeHtml(title)}</h3>
                    <div class="offers__container_texts_top">
                        <h3 class="offers__container_award">${escapeHtml(formatAward(award))}</h3>
                        <p class="offers__container_award_desc">${escapeHtml(currencySymbol(currency))}</p>
                        <p class="offers__container_award_desc">${escapeHtml(awardDesc)}</p>
                    </div>
                    <p class="offers__container_desc">${escapeHtml(description)}</p>
                    <button type="button" class="offers__container_button">Claim award</button>
                </div>
            </div>
        `;
    }

    fields.forEach((field) => {
        field.addEventListener('input', () => {
            if (field === descriptionInput) limitDescriptionRows();
            saveDraft();
            syncMakeSubmit();
            renderMakeExample();
        });

        field.addEventListener('change', () => {
            if (field === descriptionInput) limitDescriptionRows();
            saveDraft();
            syncMakeSubmit();
            renderMakeExample();
        });
    });

    function setMakePanelOpen(isOpen) {
        panel.style.height = '';
        panel.classList.toggle('admin__make_panel-active', isOpen);

        if (isOpen) {
            localStorage.setItem('make-panel-open', '1');
        } else {
            localStorage.removeItem('make-panel-open');
        }
    }

    function isDesktopAdmin() {
        return window.matchMedia('(min-width: 900px)').matches;
    }

    if (localStorage.getItem('make-panel-open') === '1') {
        setMakePanelOpen(true);
    }

    if (makeTrigger) {
        makeTrigger.addEventListener('click', () => {
            if (isDesktopAdmin()) {
                setMakePanelOpen(!panel.classList.contains('admin__make_panel-active'));
                return;
            }

            setMakePanelOpen(true);
        });
    }

    if (makeClose) {
        makeClose.addEventListener('click', () => {
            setMakePanelOpen(false);
        });
    }

    await loadMakeSelects(categorySelect, currencySelect);

    function capitalizeFirst(value) {
        const text = value.trim();

        if (text === '') {
            return '';
        }

        return text[0].toUpperCase() + text.slice(1);
    }

    function formatMakeTextFields() {
        const names = ['deadline', 'title', 'description', 'category_new', 'award_desc'];

        names.forEach((name) => {
            const field = form.elements[name];
            if (!field) return;

            field.value = capitalizeFirst(field.value);
        });
    }

    function initTextFormatting() {
        const names = ['deadline', 'title', 'description', 'category_new', 'award_desc'];

        names.forEach((name) => {
            const field = form.elements[name];
            if (!field) return;

            field.addEventListener('blur', () => {
                field.value = capitalizeFirst(field.value);
                saveDraft();
                syncMakeSubmit();
                renderMakeExample();
            });
        });
}

    if (form) {
    initTextFormatting();
    syncMakeSubmit();
    renderMakeExample();

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        formatMakeTextFields();

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

        localStorage.removeItem(draftKey);
        form.reset();
        lastValidDescription = '';

        if (categorySelect && categorySelect.tomselect) {
            categorySelect.tomselect.clear();
        }

        if (currencySelect && currencySelect.tomselect) {
            currencySelect.tomselect.clear();
        }


        loadOffers();
        syncMakeSubmit();
        renderMakeExample();
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

  const tomSelect = new TomSelect(select, {
    create: false,
    maxOptions: 200,
    placeholder
  });

  tomSelect.wrapper.classList.add('make__select_ts');
  tomSelect.dropdown.classList.add('make__select_dropdown');

}
