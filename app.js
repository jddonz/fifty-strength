const workouts = {
  1: [
    { name: 'Monday — Squat + Push', exercises: [['Goblet squat','2 × 8'],['Dumbbell bench press','2 × 10'],['Romanian deadlift','2 × 10'],['One-arm dumbbell row','2 × 10/side'],['Farmer carry','3 × 30 sec'],['Dead bug','2 × 6/side']] },
    { name: 'Wednesday — Hinge + Pull', exercises: [['Dumbbell deadlift','2 × 8–10'],['Standing dumbbell overhead press','2 × 8'],['Goblet squat','2 × 8'],['One-arm dumbbell row','2 × 10/side'],['Glute bridge','2 × 12'],['Suitcase carry','2 × 30 sec/side']] },
    { name: 'Friday — Conditioning', exercises: [['Goblet squat','2 × 8'],['Dumbbell bench press','2 × 10'],['Romanian deadlift','2 × 10']], conditioning: '8-minute easy AMRAP: 6 elevated push-ups · 8 dumbbell deadlifts · 30-sec farmer carry.' }
  ],
  2: [
    { name: 'Monday — Strength A', exercises: [['Goblet squat','3 × 8'],['Barbell bench press','3 × 8'],['Romanian deadlift','3 × 8'],['One-arm dumbbell row','3 × 10'],['Farmer carry','3 × 40 sec'],['Dead bug','2 × 8/side']] },
    { name: 'Wednesday — Strength B', exercises: [['Goblet squat','3 × 8'],['Overhead press','3 × 8'],['Dumbbell deadlift','3 × 8'],['Dumbbell row','3 × 10'],['Glute bridge','3 × 12'],['Suitcase carry','3 × 30 sec/side']] },
    { name: 'Friday — Conditioning', exercises: [['Goblet squat','3 × 8'],['Dumbbell bench press','3 × 10'],['Romanian deadlift','3 × 8']], conditioning: '10-minute AMRAP: 6 elevated push-ups · 8 dumbbell deadlifts · 10 light dumbbell rows · 30-sec farmer carry.' }
  ],
  3: [
    { name: 'Monday — Squat Day', exercises: [['Barbell back squat','3 × 6'],['Barbell bench press','3 × 6–8'],['Romanian deadlift','3 × 8'],['One-arm dumbbell row','3 × 10'],['Farmer carry','3 × 45 sec']] },
    { name: 'Wednesday — Upper Body', exercises: [['Dumbbell bench press','3 × 10'],['Overhead press','3 × 8'],['Barbell row','3 × 8–10'],['Romanian deadlift','3 × 8'],['Elevated push-up','2 × 10–15'],['Suitcase carry','3 × 40 sec/side']] },
    { name: 'Friday — Conditioning', exercises: [['Goblet squat','3 × 8'],['Dumbbell bench press','3 × 10'],['Dumbbell Romanian deadlift','3 × 10']], conditioning: '12-minute AMRAP: 8 dumbbell deadlifts · 8 elevated push-ups · 10 dumbbell rows · 30-sec farmer carry.' }
  ],
  4: [
    { name: 'Monday — Strength', exercises: [['Barbell back squat','3 × 6'],['Barbell bench press','3 × 6'],['Romanian deadlift','3 × 8'],['Dumbbell row','3 × 10'],['Farmer carry','3 × 60 sec']] },
    { name: 'Wednesday — Upper + Hinge', exercises: [['Dumbbell bench press','3 × 8–10'],['Overhead press','3 × 8'],['Barbell row','3 × 8'],['Romanian deadlift','3 × 8'],['Elevated push-ups','3 × 10–15'],['Suitcase carry','3 × 45 sec/side']] },
    { name: 'Friday — CrossFit Style', exercises: [['Goblet squat','3 × 8'],['Dumbbell bench press','3 × 8'],['Romanian deadlift','3 × 8']], conditioning: '15-minute AMRAP: 8 goblet squats · 8 dumbbell push presses · 10 dumbbell deadlifts · 8 elevated push-ups · 30–40 sec farmer carry.' }
  ]
};

const phaseInfo = {
  1: ['Weeks 1–2','Learn the movements','RPE 5–6; leave 4–5 good reps. Full comfortable squat depth is allowed.'],
  2: ['Weeks 3–4','Build strength','RPE 6–7; use double progression and add weight only when reps are clean.'],
  3: ['Weeks 5–6','Introduce the barbell squat','Start very light. RPE 6–7. Judge the squat by technique and next-day knee response.'],
  4: ['Weeks 7–8','Start becoming strong','RPE about 7. No maxing or grinding. Conditioning is challenging but controlled.']
};

const STORAGE_KEY = 'fifty-strength-data-v3';
const app = document.getElementById('app');

function escapeHtml(value) {
  return String(value == null ? '' : value)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

function loadData() {
  const defaults = { phase: 1, day: 0, logs: {} };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaults;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return defaults;
    if (!Number.isInteger(parsed.phase) || parsed.phase < 1 || parsed.phase > 4) parsed.phase = 1;
    if (!Number.isInteger(parsed.day) || parsed.day < 0 || parsed.day > 2) parsed.day = 0;
    if (!parsed.logs || typeof parsed.logs !== 'object') parsed.logs = {};
    return parsed;
  } catch (error) {
    return defaults;
  }
}

let data = loadData();

function saveData() {
  try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch (error) { /* local storage may be unavailable */ }
}

function today() {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2,'0');
  const day = String(d.getDate()).padStart(2,'0');
  return d.getFullYear() + '-' + month + '-' + day;
}

function renderToday() {
  const phase = data.phase;
  const day = data.day;
  const workout = workouts[phase][day];
  const info = phaseInfo[phase];
  const key = phase + '-' + day;
  const log = data.logs[key] || { date: today(), sets: {} };
  data.logs[key] = log;

  let exerciseHtml = '';
  workout.exercises.forEach(function(exercise, index) {
    const set = log.sets[index] || {};
    exerciseHtml += '<div class="exercise">' +
      '<div class="title-row"><div><h3>' + escapeHtml(exercise[0]) + '</h3><div class="muted small">' + escapeHtml(exercise[1]) + '</div></div></div>' +
      '<div class="inputs">' +
      '<label>Weight<input data-set="' + index + '" data-field="weight" inputmode="decimal" value="' + escapeHtml(set.weight || '') + '"></label>' +
      '<label>Reps<input data-set="' + index + '" data-field="reps" inputmode="numeric" value="' + escapeHtml(set.reps || '') + '"></label>' +
      '<label>RPE<input data-set="' + index + '" data-field="rpe" inputmode="decimal" value="' + escapeHtml(set.rpe || '') + '"></label>' +
      '</div></div>';
  });

  app.innerHTML =
    '<section class="card hero"><div class="eyebrow">PHASE ' + phase + ' · ' + escapeHtml(info[0]) + '</div>' +
    '<h2>' + escapeHtml(info[1]) + '</h2><p>' + escapeHtml(workout.name) + '</p><p class="muted">' + escapeHtml(info[2]) + '</p></section>' +
    '<section class="card"><h2>Workout</h2>' + exerciseHtml + (workout.conditioning ? '<div class="notice"><strong>Conditioning</strong><p>' + escapeHtml(workout.conditioning) + '</p></div>' : '') + '</section>' +
    '<section class="card"><h2>Session log</h2><div class="inputs">' +
    '<label>Date<input type="date" data-session="date" value="' + escapeHtml(log.date || today()) + '"></label>' +
    '<label>Session RPE<input type="number" min="1" max="10" step="0.5" data-session="rpe" value="' + escapeHtml(log.sessionRpe || '') + '"></label>' +
    '<label>Knee next morning<input type="number" min="0" max="10" step="1" data-session="knee" value="' + escapeHtml(log.knee || '') + '"></label>' +
    '</div><label class="small muted">Notes<input data-session="notes" value="' + escapeHtml(log.notes || '') + '"></label>' +
    '<p class="small muted">Workout data is stored locally on this device.</p></section>' +
    '<section class="card"><button class="primary" id="complete">Complete &amp; Next Workout</button></section>';

  document.querySelectorAll('[data-set]').forEach(function(input) {
    input.addEventListener('input', function() {
      const index = input.getAttribute('data-set');
      const field = input.getAttribute('data-field');
      if (!log.sets[index]) log.sets[index] = {};
      log.sets[index][field] = input.value;
      saveData();
    });
  });

  document.querySelectorAll('[data-session]').forEach(function(input) {
    input.addEventListener('input', function() {
      const field = input.getAttribute('data-session');
      if (field === 'date') log.date = input.value;
      if (field === 'rpe') log.sessionRpe = input.value;
      if (field === 'knee') log.knee = input.value;
      if (field === 'notes') log.notes = input.value;
      saveData();
    });
  });

  document.getElementById('complete').addEventListener('click', function() {
    log.completed = true;
    log.completedAt = new Date().toISOString();
    data.day += 1;
    if (data.day > 2) {
      data.day = 0;
      if (data.phase < 4) data.phase += 1;
    }
    saveData();
    renderToday();
  });

  saveData();
}

function renderProgram() {
  let html = '<section class="card hero"><h2>8-Week Program</h2><p class="muted">Start lighter than you think you need. Increase when reps are clean and your next-day knee response is stable.</p></section>';
  [1,2,3,4].forEach(function(phase) {
    const info = phaseInfo[phase];
    html += '<section class="card"><div class="eyebrow">PHASE ' + phase + ' · ' + escapeHtml(info[0]) + '</div><h2>' + escapeHtml(info[1]) + '</h2><p>' + escapeHtml(info[2]) + '</p>';
    workouts[phase].forEach(function(day) {
      html += '<div class="exercise"><strong>' + escapeHtml(day.name) + '</strong><div class="muted small">';
      day.exercises.forEach(function(exercise, index) {
        if (index) html += ' · ';
        html += escapeHtml(exercise[0]) + ' — ' + escapeHtml(exercise[1]);
      });
      html += '</div>' + (day.conditioning ? '<div class="muted small"><strong>Conditioning:</strong> ' + escapeHtml(day.conditioning) + '</div>' : '') + '</div>';
    });
    html += '</section>';
  });
  app.innerHTML = html;
}

function renderProgress() {
  const logs = Object.keys(data.logs).map(function(key) { return { key: key, log: data.logs[key] }; });
  const completed = logs.filter(function(item) { return item.log.completed; }).length;
  let history = '';
  logs.reverse().forEach(function(item) {
    history += '<div class="exercise"><strong>Workout ' + escapeHtml(item.key) + '</strong><div class="muted small">Date: ' + escapeHtml(item.log.date || '—') + ' · Session RPE: ' + escapeHtml(item.log.sessionRpe || '—') + ' · Knee next morning: ' + escapeHtml(item.log.knee || '—') + '</div></div>';
  });
  const percent = Math.min(100, completed / 12 * 100);
  app.innerHTML = '<section class="card hero"><h2>Progress</h2><p>' + logs.length + ' workout log' + (logs.length === 1 ? '' : 's') + ' saved.</p><div class="progressbar"><div style="width:' + percent + '%"></div></div><p class="muted small">Completed workouts: ' + completed + ' / 12</p></section>' +
    '<section class="card"><h2>Training rule</h2><p>Start new movements around RPE 5–6. For rep ranges, build toward the top of the range before adding weight.</p><p class="notice warning"><strong>Knee:</strong> sharp pain, swelling, instability, locking/catching, limping, or significant worsening means back off and consider evaluation.</p></section>' +
    '<section class="card"><h2>Workout history</h2>' + (history || '<p class="muted">Your completed workouts will appear here.</p>') + '</section>';
}

function showView(view) {
  document.querySelectorAll('.tab').forEach(function(button) {
    button.classList.toggle('active', button.getAttribute('data-view') === view);
  });
  if (view === 'today') renderToday();
  else if (view === 'program') renderProgram();
  else if (view === 'progress') renderProgress();
}

document.querySelectorAll('.tab').forEach(function(button) {
  button.addEventListener('click', function() { showView(button.getAttribute('data-view')); });
});

try {
  renderToday();
} catch (error) {
  app.innerHTML = '<section class="card"><h2>App error</h2><p>The app could not render this screen.</p><pre style="white-space:pre-wrap;overflow:auto">' + escapeHtml(error && error.message ? error.message : error) + '</pre></section>';
  console.error('Fifty Strength render error', error);
}
