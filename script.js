let selectedOps = new Set(['×']);
let correct = [0, 0, 0], wrong = [0, 0, 0];
let timer = 90;
let countdownValue = 5;
let countdownInterval;
let gameInterval;
let currentProblem;
let gameEnded = false; // ✅ oyun bitmesini takip etmek için

function showOpScreen() {
  document.getElementById('startScreen').classList.remove('active');
  document.getElementById('opScreen').classList.add('active');
  refreshCheckboxes();
}

function confirmOps() {
  if (selectedOps.size === 0) { alert('En az bir işlem seçin'); return; }
  document.getElementById('opScreen').classList.remove('active');
  showCountdown();
}

function showCountdown() {
  const cd = document.getElementById('countdown');
  cd.style.display = 'flex';
  countdownValue = 5;
  cd.innerText = countdownValue;
  countdownInterval = setInterval(() => {
    countdownValue--;
    if (countdownValue > 0) {
      cd.innerText = countdownValue;
    } else {
      clearInterval(countdownInterval);
      cd.style.display = 'none';
      document.getElementById('gameScreen').style.display = 'block';
      startGame();
    }
  }, 1000);
}

function toggleOp(op) { selectedOps.has(op) ? selectedOps.delete(op) : selectedOps.add(op); refreshCheckboxes(); }
function selectAll() { ['+', '-', '×', '÷'].forEach(o => selectedOps.add(o)); refreshCheckboxes(); }
function clearAll() { selectedOps.clear(); refreshCheckboxes(); }
function refreshCheckboxes() { ['+', '-', '×', '÷'].forEach(o => { document.getElementById('box' + (o === '+' ? 'Plus' : o === '-' ? 'Minus' : o === '×' ? 'Mul' : 'Div')).classList.toggle('selected', selectedOps.has(o)); }); }

function randomProblem() {
  const ops = Array.from(selectedOps);
  const op = ops[Math.floor(Math.random() * ops.length)];
  let a, b, text, result;
  switch (op) {
    case '+': a = Math.floor(Math.random() * 20); b = Math.floor(Math.random() * 20); text = `${a}+${b}`; result = a + b; break;
    case '-': a = Math.floor(Math.random() * 20); b = Math.floor(Math.random() * 20); text = `${a}-${b}`; result = a - b; break;
    case '×': a = Math.floor(Math.random() * 12); b = Math.floor(Math.random() * 12); text = `${a}×${b}`; result = a * b; break;
    case '÷': b = Math.floor(Math.random() * 11) + 1; result = Math.floor(Math.random() * 12); a = result * b; text = `${a}÷${b}`; break;
  }
  return { text, result };
}

function newQuestionAllPlayers() {
  currentProblem = randomProblem();
  for (let i = 1; i <= 3; i++) {
    document.getElementById('problem' + i).innerText = currentProblem.text;
    const c = document.getElementById('answers' + i);
    c.innerHTML = '';
    let answers = [currentProblem.result];
    while (answers.length < 3) {
      let fake = currentProblem.result + (Math.floor(Math.random() * 11) - 5);
      if (!answers.includes(fake)) answers.push(fake);
    }
    answers.sort(() => Math.random() - 0.5);
    answers.forEach(ans => {
      const btn = document.createElement('button');
      btn.innerText = ans;
      btn.onclick = () => {
        if (gameEnded) return; // ✅ oyun bittiyse cevap işlemeyi durdur
        if (ans === currentProblem.result) {
          correct[i - 1]++;
          // ✅ 10 doğru yapan olursa oyun bitsin
          if (correct[i - 1] >= 10) {
            endGame();
            return;
          }
        } else {
          wrong[i - 1]++;
        }
        newQuestionAllPlayers();
      };
      c.appendChild(btn);
    });
  }
}

function startGame() {
  correct = [0, 0, 0];
  wrong = [0, 0, 0];
  gameEnded = false;
  timer = 90;
  document.getElementById('timer').style.display = 'flex';
  newQuestionAllPlayers();
  updateTimer();
  gameInterval = setInterval(() => {
    if (gameEnded) return; // ✅ oyun bittiyse zaman akmasın
    timer--;
    updateTimer();
    if (timer <= 0) {
      clearInterval(gameInterval);
      endGame();
    }
  }, 1000);
}

function updateTimer() {
  const timerEl = document.getElementById('timer');
  timerEl.innerText = timer;
}

function endGame() {
  if (gameEnded) return; // ✅ tekrar çalışmasın
  gameEnded = true;
  clearInterval(gameInterval);
  document.getElementById('score1').innerText = `Oyuncu 1 → ✅ ${correct[0]} ❌ ${wrong[0]}`;
  document.getElementById('score2').innerText = `Oyuncu 2 → ✅ ${correct[1]} ❌ ${wrong[1]}`;
  document.getElementById('score3').innerText = `Oyuncu 3 → ✅ ${correct[2]} ❌ ${wrong[2]}`;
  document.getElementById('resultScreen').style.display = 'flex';
}
