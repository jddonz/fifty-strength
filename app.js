const workouts = {
  1: [
    ['Monday — Squat + Push', [['Goblet squat','2 × 8'],['Dumbbell bench press','2 × 10'],['Romanian deadlift','2 × 10'],['One-arm dumbbell row','2 × 10/side'],['Farmer carry','3 × 30 sec'],['Dead bug','2 × 6/side']]],
    ['Wednesday — Hinge + Pull', [['Dumbbell deadlift','2 × 8–10'],['Standing dumbbell overhead press','2 × 8'],['Goblet squat','2 × 8'],['One-arm dumbbell row','2 × 10/side'],['Glute bridge','2 × 12'],['Suitcase carry','2 × 30 sec/side']]],
    ['Friday — Conditioning', [['Goblet squat','2 × 8'],['Dumbbell bench press','2 × 10'],['Romanian deadlift','2 × 10']], '8-minute easy AMRAP: 6 elevated push-ups · 8 dumbbell deadlifts · 30-sec farmer carry.']
  ],
  2: [
    ['Monday — Strength A', [['Goblet squat','3 × 8'],['Barbell bench press','3 × 8'],['Romanian deadlift','3 × 8'],['One-arm dumbbell row','3 × 10'],['Farmer carry','3 × 40 sec'],['Dead bug','2 × 8/side']]],
    ['Wednesday — Strength B', [['Goblet squat','3 × 8'],['Overhead press','3 × 8'],['Dumbbell deadlift','3 × 8'],['Dumbbell row','3 × 10'],['Glute bridge','3 × 12'],['Suitcase carry','3 × 30 sec/side']]],
    ['Friday — Conditioning', [['Goblet squat','3 × 8'],['Dumbbell bench press','3 × 10'],['Romanian deadlift','3 × 8']], '10-minute AMRAP: 6 elevated push-ups · 8 dumbbell deadlifts · 10 light dumbbell rows · 30-sec farmer carry.']
  ],
  3: [
    ['Monday — Squat Day', [['Barbell back squat','3 × 6'],['Barbell bench press','3 × 6–8'],['Romanian deadlift','3 × 8'],['One-arm dumbbell row','3 × 10'],['Farmer carry','3 × 45 sec']]],
    ['Wednesday — Upper Body', [['Dumbbell bench press','3 × 10'],['Overhead press','3 × 8'],['Barbell row','3 × 8–10'],['Romanian deadlift','3 × 8'],['Elevated push-up','2 × 10–15'],['Suitcase carry','3 × 40 sec/side']]],
    ['Friday — Conditioning', [['Goblet squat','3 × 8'],['Dumbbell bench press','3 × 10'],['Dumbbell Romanian deadlift','3 × 10']], '12-minute AMRAP: 8 dumbbell deadlifts · 8 elevated push-ups · 10 dumbbell rows · 30-sec farmer carry.']
  ],
  4: [
    ['Monday — Strength', [['Barbell back squat','3 × 6'],['Barbell bench press','3 × 6'],['Romanian deadlift','3 × 8'],['Dumbbell row','3 × 10'],['Farmer carry','3 × 60 sec']]],
    ['Wednesday — Upper + Hinge', [['Dumbbell bench press','3 × 8–10'],['Overhead press','3 × 8'],['Barbell row','3 × 8'],['Romanian deadlift','3 × 8'],['Elevated push-ups','3 × 10–15'],['Suitcase carry','3 × 45 sec/side']]],
    ['Friday — CrossFit Style', [['Goblet squat','3 × 8'],['Dumbbell bench press','3 × 8'],['Romanian deadlift','3 × 8']], '15-minute AMRAP: 8 goblet squats · 8 dumbbell push presses · 10 dumbbell deadlifts · 8 elevated push-ups · 30–40 sec farmer carry.']
  ]
};

const phaseInfo = {
  1: ['Weeks 1–2', 'Learn the movements', 'RPE 5–6; leave 4–5 good reps. Full comfortable squat depth is allowed.'],
  2: ['Weeks 3–4', 'Build strength', 'RPE 6–7; use double progression and add weight only when reps are clean.'],
  3: ['Weeks 5–6', 'Introduce the barbell squat', 'Start very light. RPE 6–7. Judge the squat by technique and next-day knee response.'],
  4: ['Weeks 7–8', 'Start becoming strong', 'RPE about 7. No maxing or grinding. Conditioning is challenging but controlled.']
};

const KEY = 'fifty-strength-data-v2';
let data;
try {
  data = JSON.parse(localStorage.getItem(KEY) || 'null');
} catch (error) {
  data = null;
}
if (!data || typeof data !== 'object') data = { phase: 1, day: 0, logs: {} };
if (!Number.isInteger(data.phase) || data.phase < 1 || data.phase > 4) data.phase = 1;
if (!Number.isInteger(data.day) || data.day < 0 || data.day > 2) data.day = 0;
if (!data.logs || typeof data.logs !== 'object') data.logs = {};

const app = document.getElementById('app');

function esc(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function save() {
  localStorage.setItem(KEY, JSON.stringify(data));
}

function todayString() {
  return new Date().toISOString().slice(0, 10);
}

function renderToday() {
  const phase = data.phase;
  const day = data.day;
  const workout = workouts[phase][day];
  const info = phaseInfo[phase];
  const id = phase + '-' + day;
  const log = data.logs[id] || {};

  if (!log.date) log.date = todayString();

  let exercises = '';
  workout[1].forEach(function(item, index) {
    const weight = log[index + 'w'] || '';
    const reps = log[index + 'r'] || '';
    const rpe = log[index + 'e'] || '';
    exercises += '<div class="exercise">' +
      '<div class="title-row"><div><h3>' + esc(item[0]) + '</h3><div class="muted small">' + esc(item[1]) + '</div></div>' +
      '<input class="check" type="checkbox" aria-label="Complete ' + esc(item[0]) + '"></div>' +
      '<div class="inputs">' +
      '<label>Weight<input data-f="' + index + 'w" inputmode="decimal" value="' + esc(weight) + '"></label>' +
      '<label>Reps<input data-f="' + index + 'r" inputmode="numeric" value="' + esc(reps) + '"></label>' +
      '<label>RPE<input data-f="' + index + 'e" inputmode="decimal" value="' + esc(rpe) + '"></label>' +
      '</div></div>';
  });

  const conditioning = workout[2] ? '<div class="notice"><strong>Conditioning</strong><p>' + esc(workout[2]) + '</p></div>' : '';

  app.innerHTML =
    '<section class="card hero"><div class="eyebrow">PHASE ' + phase + ' · ' + esc(info[0]) + '</div>' +
    '<h2>' + esc(info[1]) + '</h2><p>' + esc(workout[0]) + '</p><p class="muted">' + esc(info[2]) + '</p></section>' +
    '<section class="card"><h2>Workout</h2>' + exercises + conditioning + '</section>' +
    '<section class="card"><h2>Session log</h2>' +
    '<div class="inputs"><label>Date<input type="date" data-f="date" value="' + esc(log.date) + '"></label>' +
    '<label>Session RPE<input type="number" min="1" max="10" step="0.5" data-f="session" value="' + esc(log.session || '') + '"></label>' +
    '<label>Knee next morning<input type="number" min="0" max="10" step="1" data-f="knee" value="' + esc(log.knee || '') + '"></label></div>' +
    '<label class="small muted">Notes<input data-f="notes" value="' + esc(log.notes || '') + '"></label>' +
    '<p class="small muted">Workout data is stored locally on this device.</p></section>' +
    '<section class="card"><button class="primary" id="next">Complete &amp; Next Workout</button></section>';

  data.logs[id] = log;
  save();

  document.querySelectorAll('[data-f]').forEach(function(field) {
    field.addEventListener('input', function() {
      log[field.getAttribute('data-f')] = field.value;
      save();
    });
  });

  document.getElementById('next').addEventListener('click', function() {
    data.day += 1;
    if (data.day > 2) {
      data.day = 0;
      if (data.phase < 4) data.phase += 1;
    }
    save();
    renderToday();
  });
}

function renderProgram() {
  let html = '<section class="card hero"><h2>8-Week Program</h2><p class="muted">Start lighter than you think you need. Increase when reps are clean and your next-day knee response is stable.</p></section>';
  [1,2,3,4].forEach(function(phase) {
    const info = phaseInfo[phase];
    html += '<section class="card"><div class="eyebrow">PHASE ' + phase + ' · ' + esc(info[0]) + '</div><h2>' + esc(info[1]) + '</h2><p>' + esc(info[2]) + '</p>';
    workouts[phase].forEach(function(day) {
      html += '<div class="exercise"><strong>' + esc(day[0]) + '</strong><div class="muted small">';
      day[1].forEach(function(item, index) {
        if (index) html += ' · ';
        html += esc(item[0]) + ' — ' + esc(item[1]);
      });
      html += '</div>';
      if (day[2]) html += '<div class="muted small"><strong>Conditioning:</strong> ' + esc(day[2]) + '</div>';
      html += '</div>';
    });
    html += '</section>';
  });
  app.innerHTML = html;
}

function renderProgress() {
  const ids = Object.keys(data.logs);
  const completed = ids.filter(function(id) { return data.logs[id] && data.logs[id].completed; }).length;
  const logged = ids.length;
  const percent = Math.min(100, (completed / 12) * 100);
  let history = '';
  ids.slice().reverse().forEach(function(id) {
    const log = data.logs[id];
    history += '<div class="exercise"><strong>Workout ' + esc(id) + '</strong><div class="muted small">' +
      'Date: ' + esc(log.date || '—') + ' · Session RPE: ' + esc(log.session || '—') + ' · Knee next morning: ' + esc(log.knee || '—') + '</div></div>';
  });
  app.innerHTML = '<section class="card hero"><h2>Progress</h2><p>' + logged + ' workout log' + (logged === 1 ? '' : 's') + ' saved.</p>' +
    '<div class="progressbar"><div style="width:' + percent + '%"></div></div><p class="muted small">Complete workouts: ' + completed + ' / 12</p></section>' +
    '<section class="card"><h2>Training rule</h2><p>Start new movements around RPE 5–6. For rep ranges, build toward the top of the range before adding weight.</p>' +
    '<p class="notice warning"><strong>Knee:</strong> mild temporary ache is information. Sharp pain, swelling, instability, locking/catching, limping, or significant worsening means back off and consider evaluation.</p></section>' +
    '<section class="card"><h2>Workout history</h2>' + (history || '<p class="muted">Your completed workouts will appear here.</p>') + '</section>';
}

function setActiveTab(view) {
  document.querySelectorAll('.tab').forEach(function(button) {
    button.classList.toggle('active', button.getAttribute('data-view') === view);
  });
}

document.querySelectorAll('.tab').forEach(function(button) {
  button.addEventListener('click', function() {
    const view = button.getAttribute('data-view');
    setActiveTab(view);
    if (view === 'today') renderToday();
    if (view === 'program') renderProgram();
    if (view === 'progress') renderProgress();
  });
});

renderToday();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').catch(function() {});
}
