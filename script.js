document.addEventListener('DOMContentLoaded', () => {
  // 캔버스 설정
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 800;
  canvas.height = 600;

  // 다시하기 버튼 설정
  const restartButton = document.getElementById('restartButton');
  restartButton.addEventListener('click', restartGame);

  // 게임 상태
  let isGameOver = false;
  let score = 0;

  // 플레이어 설정
  const player = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 50,
    width: 50,
    height: 50,
    speed: 5,
    color: 'blue'
  };

  // 키보드 입력 설정
  const keys = {};
  document.addEventListener('keydown', (e) => keys[e.key] = true);
  document.addEventListener('keyup', (e) => keys[e.key] = false);

  // 총알 설정
  const bullets = [];

  // 적 설정
  const enemies = [];
  function spawnEnemy() {
    const type = Math.random();
    const x = Math.random() * (canvas.width - 50);

    let enemy = {
      x,
      y: -50,
      width: 50,
      height: 50,
      speed: 2,
      color: 'red',
      type: 'normal',
    };

    if (type < 0.5) {
      // 빠른 적
      enemy.speed = 4;
      enemy.color = 'green';
      enemy.type = 'fast';
    } else if (type < 0.8) {
      // 강한 적
      enemy.speed = 1;
      enemy.color = 'purple';
      enemy.type = 'strong';
    }

    enemies.push(enemy);
  }

  // 충돌 감지 함수
  function detectCollision(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
      obj1.x + obj1.width > obj2.x &&
      obj1.y < obj2.y + obj2.height &&
      obj1.y + obj1.height > obj2.y;
  }

  // 게임 루프
  function gameLoop() {
    if (isGameOver) {
      ctx.font = '48px serif';
      ctx.fillStyle = 'white';
      ctx.fillText('Game Over', canvas.width / 2 - 120, canvas.height / 2);
      ctx.font = '24px serif';
      ctx.fillText('Score: ' + score, canvas.width / 2 - 60, canvas.height / 2 + 50);
      restartButton.style.display = 'block';
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 플레이어 이동
    if (keys['ArrowLeft'] && player.x > 0) player.x -= player.speed;
    if (keys['ArrowRight'] && player.x < canvas.width - player.width) player.x += player.speed;
    if (keys['ArrowUp'] && player.y > 0) player.y -= player.speed;
    if (keys['ArrowDown'] && player.y < canvas.height - player.height) player.y += player.speed;

    // 총알 발사
    if (keys[' ']) {
      bullets.push({ x: player.x + player.width / 2 - 2.5, y: player.y, width: 5, height: 10, speed: 7, color: 'purple' });
      keys[' '] = false; // 한번 누르면 발사하게 설정
    }

    // 총알 이동
    bullets.forEach((bullet, index) => {
      bullet.y -= bullet.speed;
      if (bullet.y + bullet.height < 0) bullets.splice(index, 1);
    });

    // 적 이동 및 충돌 검사
    enemies.forEach((enemy, index) => {
      enemy.y += enemy.speed;
      if (enemy.y > canvas.height) enemies.splice(index, 1); // 적이 화면을 벗어나면 제거

      bullets.forEach((bullet, bIndex) => {
        if (detectCollision(bullet, enemy)) {
          enemies.splice(index, 1);
          bullets.splice(bIndex, 1);
          score += enemy.type === 'strong' ? 20 : 10; // 강한 적은 더 많은 점수
        }
      });

      // 플레이어와 적의 충돌 검사
      if (detectCollision(player, enemy)) {
        isGameOver = true;
      }
    });

    // 적 생성
    if (Math.random() < 0.02) spawnEnemy();

    // 플레이어 그리기
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // 총알 그리기
    bullets.forEach(bullet => {
      ctx.fillStyle = bullet.color;
      ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });

    // 적 그리기
    enemies.forEach(enemy => {
      ctx.fillStyle = enemy.color;
      ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    });

    // 점수 표시
    ctx.font = '24px serif';
    ctx.fillStyle = 'white';
    ctx.fillText('Score: ' + score, 10, 30);

    requestAnimationFrame(gameLoop);
  }

  // 게임 재시작 함수
  function restartGame() {
    isGameOver = false;
    score = 0;
    player.x = canvas.width / 2 - 25;
    player.y = canvas.height - 50;
    bullets.length = 0;
    enemies.length = 0;
    restartButton.style.display = 'none';
    gameLoop();
  }

  // 게임 시작
  gameLoop();
});
