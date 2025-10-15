let gameOver = false;
answers.forEach(ans => {
  const btn = document.createElement('button');
  btn.innerText = ans;
  btn.onclick = () => {
    if(gameOver) return; // oyun bitti, işlem yok

    if(ans === p.result){
      if(player === 1) correct1++; else correct2++;
      if(correct1 >= 10 || correct2 >= 10){
        endGame();
        return;
      }
    } else {
      if(player === 1) wrong1++; else wrong2++;
      if(player === 1) hearts1--; else hearts2--;
      updateHearts();
      if(hearts1 <= 0 || hearts2 <= 0){
        endGame();
        return;
      }
    }

    // Sadece oyun devam ediyorsa yeni soruya geç
    if(!gameOver) newQuestion(player);
  };
  container.appendChild(btn);
});
function endGame(){
  gameOver = true; // artık oyun bitti
  clearInterval(timerInterval);

  // tüm cevap butonlarını devre dışı bırak
  document.querySelectorAll('.answers button').forEach(b => b.disabled = true);

  let winner = '';
  if(correct1 >= 10) winner = 'Grup 1 Kazandı! 🎉';
  else if(correct2 >= 10) winner = 'Grup 2 Kazandı! 🎉';
  else winner = 'Oyun Bitti!';

  document.getElementById('score1').innerText = `Grup 1 → Doğru: ${correct1}  Yanlış: ${wrong1}`;
  document.getElementById('score2').innerText = `Grup 2 → Doğru: ${correct2}  Yanlış: ${wrong2}`;
  document.getElementById('resultScreen').style.display = 'flex';
  document.querySelector('#resultScreen h2').innerText = winner;
}
// Oyun değişkenleri
function startGame(){
  
  hearts1=3; hearts2=3; correct1=0; wrong1=0; correct2=0; wrong2=0;
  updateHearts();
  document.getElementById('timeVal').innerText = timer;
  newQuestion(1); 
  newQuestion(2);
  
  if(timerInterval) clearInterval(timerInterval);
  
}
