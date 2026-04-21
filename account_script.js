let form = document.querySelector('.personal_space');
let submit = form.querySelector('.personal__submit');
let cancel = form.querySelector('.personal__cancel');
let fields = [...form.querySelectorAll('input:not([type="submit"]):not([type="button"]), select, textarea')];
 //... превращение в массив. Удобно

let initial = new Map(
  fields.map((f) => [f.name, f.type === 'file' ? '' : f.value])
);

function hasChanges() {
  return fields.some((f) => {
    if (f.type === 'file') return f.files.length > 0;
    return f.value !== initial.get(f.name);
  });
}



function syncSubmit() {
  let changed = hasChanges();
  submit.style.display = changed ? 'block' : 'none';
  cancel.style.display = changed ? 'block' : 'none';
  submit.disabled = !changed;
  cancel.disabled = !changed;
}


let avatarImg = document.querySelector('.personal__avatar');
let avatarInput = document.querySelector('#avatarInput');
let avatarName = document.querySelector('.personal__avatar_upload_name');

let originalAvatarSrc = avatarImg ? avatarImg.src : '';
let previewUrl = '';

if (avatarInput && avatarImg) {
  avatarInput.addEventListener('change', () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl); //revokeObjectURL удаляет прошлую ссылку
    if (avatarInput.files.length) {
      previewUrl = URL.createObjectURL(avatarInput.files[0]);
      avatarImg.src = previewUrl;
      if (avatarName) avatarName.textContent = avatarInput.files[0].name;
      if (cancel) cancel.style.display = 'inline-block';
    }
    syncSubmit();
  });
}

if (cancel) {
  cancel.addEventListener('click', () => {
    fields.forEach((f) => {
      if (f.type === 'file') f.value = '';
      else f.value = initial.get(f.name) ?? '';
    });
    avatarImg.src = originalAvatarSrc;
    if (avatarName) avatarName.textContent = '';
    syncSubmit();
  });
}
form.addEventListener('input', syncSubmit);
form.addEventListener('change', syncSubmit);
syncSubmit();