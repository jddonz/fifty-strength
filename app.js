const buttons = [...document.querySelectorAll('nav button')];
const phases = [...document.querySelectorAll('.phase')];

function showPhase(id, updateHash) {
  phases.forEach(function (p) { p.classList.toggle('active', p.id === id); });
  buttons.forEach(function (b) { b.classList.toggle('active', b.dataset.phase === id); });
  if (updateHash) history.replaceState(null, '', '#' + id);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

buttons.forEach(function (button) {
  button.addEventListener('click', function () { showPhase(button.dataset.phase, true); });
});

const initialPhase = location.hash.replace('#', '');
showPhase(phases.some(function (p) { return p.id === initialPhase; }) ? initialPhase : 'phase1', false);

document.querySelectorAll('.exercise input[type=checkbox]').forEach(function (box, index) {
  const key = 'reference-check-' + index;
  try {
    box.checked = window.localStorage.getItem(key) === '1';
  } catch (error) { /* localStorage unavailable */ }
  if (box.checked) box.closest('.exercise').classList.add('done');

  box.addEventListener('change', function () {
    try {
      window.localStorage.setItem(key, box.checked ? '1' : '0');
    } catch (error) { /* localStorage unavailable */ }
    box.closest('.exercise').classList.toggle('done', box.checked);
  });
});
