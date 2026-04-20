let form = document.querySelector('.personal_space');
let submit = form.querySelector('.personal__submit');
let fields = [...form.querySelectorAll('input:not([type="submit"]), select, textarea')];
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
  submit.disabled = !changed;
}

form.addEventListener('input', syncSubmit);
form.addEventListener('change', syncSubmit);
syncSubmit();
