const authButtons = document.querySelectorAll('[data-auth-target]');
const authPanels = document.querySelectorAll('[data-auth-panel]');

function openAuthPanel(target) {
    authPanels.forEach((panel) => {
        const isTarget = panel.dataset.authPanel === target;
        const overlay = panel.closest('.auth_overlay');

        panel.classList.toggle('account__enter-active', isTarget);
        overlay.classList.toggle('auth_overlay-active', isTarget);
    });

    localStorage.setItem('openedAuthPanel', target);
}

function closeAuthPanels() {
    authPanels.forEach((panel) => {
        const overlay = panel.closest('.auth_overlay');

        panel.classList.remove('account__enter-active');
        overlay.classList.remove('auth_overlay-active');
    });

    localStorage.removeItem('openedAuthPanel');
}

authButtons.forEach((button) => {
    button.addEventListener('click', () => {
        openAuthPanel(button.dataset.authTarget);
    });
});

document.addEventListener('click', (e) => {
    const closeButton = e.target.closest('.account__enter_close');

    if (closeButton) {
        closeAuthPanels();
    }
});

const savedPanel = localStorage.getItem('openedAuthPanel');

if (savedPanel) {
    openAuthPanel(savedPanel);
}
const authFields = document.querySelectorAll(
    '.account__enter input, .account__enter select, .account__enter textarea'
);

authFields.forEach((field) => {
    if (field.type === 'password' || field.type === 'file') return;
    if (!field.name) return;

    const panel = field.closest('[data-auth-panel]');
    if (!panel) return;

    const key = `authField:${panel.dataset.authPanel}:${field.name}`;
    const savedValue = localStorage.getItem(key);

    if (savedValue !== null) {
        field.value = savedValue;
    }

    field.addEventListener('input', () => {
        localStorage.setItem(key, field.value);
    });

    field.addEventListener('change', () => {
        localStorage.setItem(key, field.value);
    });
});

function clearAuthFields() {
    Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('authField:')) {
            localStorage.removeItem(key);
        }
    });
}

if (window.IS_AUTH || window.AUTH_SUCCESS) {
    clearAuthFields();
    localStorage.removeItem('openedAuthPanel');
}
document.querySelectorAll('.auth_overlay').forEach((overlay) => {
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeAuthPanels();
        }
    });
});

const avatarInput = document.querySelector('.account__avatar');
const avatarPreview = document.querySelector('.account__avatar_preview');

let avatarPreviewUrl = '';

if (avatarInput && avatarPreview) {
    avatarInput.addEventListener('change', () => {
        if (avatarPreviewUrl) {
            URL.revokeObjectURL(avatarPreviewUrl);
            avatarPreviewUrl = '';
        }

        const file = avatarInput.files[0];

        if (!file) {
            avatarPreview.src = 'users_avatars/user_default.png';
            return;
        }

        avatarPreviewUrl = URL.createObjectURL(file);
        avatarPreview.src = avatarPreviewUrl;
    });
}


function capitalizeFirstLetter(input) {
    const value = input.value.trim();

    if (!value) return;

    input.value = value.charAt(0).toUpperCase() + value.slice(1);
}

function capitalizeWords(value) {
    return value.replace(/\b\p{L}/gu, (letter) => letter.toUpperCase());
}

function capitalizeFirst(value) {
    return value.replace(/\p{L}/u, (letter) => letter.toUpperCase());
}

const nameInput = document.querySelector('.account__name');
const descInput = document.querySelector('.account__desc');

if (nameInput) {
    nameInput.addEventListener('input', () => {
        const cursor = nameInput.selectionStart;

        nameInput.value = capitalizeWords(nameInput.value);
        nameInput.setSelectionRange(cursor, cursor);
    });
}

if (descInput) {
    descInput.addEventListener('input', () => {
        const cursor = descInput.selectionStart;

        descInput.value = capitalizeFirst(descInput.value);
        descInput.setSelectionRange(cursor, cursor);
    });
}

const authForms = document.querySelectorAll('.account__enter_inputs');

authForms.forEach((form) => {
    const submit = form.querySelector('.account__submit');

    if (!submit) return;

    function syncSubmitState() {
        submit.disabled = !form.checkValidity();
    }

    form.addEventListener('input', syncSubmitState);
    form.addEventListener('change', syncSubmitState);

    syncSubmitState();
});

const expInput = document.querySelector('.account__exp');

if (expInput) {
    expInput.addEventListener('input', () => {
        expInput.value = expInput.value.replace(/\D/g, '');
    });
}

if (window.AUTH_SUCCESS || window.LOGIN_SUCCESS) {
    runConfetti();
}

function runConfetti() {
    const root = document.createElement('div');
    root.className = 'confetti';
    document.body.append(root);

    for (let i = 0; i < 42; i++) {
        const piece = document.createElement('span');
        piece.style.left = `${Math.random() * 100}%`;
        piece.style.animationDelay = `${Math.random() * 0.6}s`;
        piece.style.backgroundColor = ['#FF4800', '#FFB19F', '#111111', '#FFFFFF', '#49a373'][i % 5];
        root.append(piece);
    }

    setTimeout(() => root.remove(), 1000);
}

function formatAward(award) {
    const number = Number(award);

    if (!Number.isFinite(number)) {
        return award || '0';
    }

    return number.toLocaleString('en-US');
}