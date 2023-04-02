const menu = document.getElementById("menu");
const start = document.getElementById("start");
const player = document.getElementById("player");
let player2 = document.getElementById("player2");
let score = 0;
const startmenu = document.getElementById("startmenu");

let x = 0;
let y = 0;
let vx = 0;
let vy = 0;
const gravity = 0.7;
const jumpVelocity = -10;

const leftBorder = 25;
const rightBorder = window.innerWidth - 170 + -player2.offsetWidth;
const topBorder = 0;
const bottomBorder = window.innerHeight - 280 + -player2.offsetHeight + -10;

document.addEventListener("keydown", (event) => {
  if (event.key === "w") {
    vy = jumpVelocity;
  } else if (event.key === "a") {
    vx = -5;
  } else if (event.key === "d") {
    vx = 5;
  }
});

document.addEventListener("keyup", (event) => {
  if (event.key === "a" || event.key === "d") {
    vx = 0;
  }
});

function update() {
  vy += gravity;

  x += vx;
  y += vy;

  if (x < leftBorder) {
    x = leftBorder;
  } else if (x > rightBorder) {
    x = rightBorder;
  }

  if (y < topBorder) {
    y = topBorder;
    vy = 0;
  } else if (y > bottomBorder) {
    y = bottomBorder;
    vy = 0;
  }

  player2.style.left = x + "px";
  player2.style.top = y + "px";

  requestAnimationFrame(update);
}

requestAnimationFrame(update);

const bullet = new Image();
bullet.src = "./res/img/bullet.png";

const projectiles = [];

let check = true;

function launchProjectile(projectile) {
  let position = parseInt(projectile.style.top);
  let intervalId = setInterval(() => {
    position -= 5;
    projectile.style.top = position + "px";
    if (position <= 0) {
      clearInterval(intervalId);
      projectile.remove();
      projectiles.splice(projectiles.indexOf(projectile), 1);
    }
  }, 10);
}

function createProjectile(x2, y2) {
  const projectile = document.createElement("div");
  projectile.classList.add("projectile");
  projectile.style.top = y2 + "px";
  projectile.style.left = x2 + "px";
  projectiles.push(projectile);
  document.body.appendChild(projectile);
  launchProjectile(projectile);
}

document.addEventListener("click", (event) => {
  if (!check) {
    createProjectile(event.clientX, event.clientY);
  }
});

function launchAllProjectiles() {
  projectiles.forEach((projectile) => {
    launchProjectile(projectile);
  });
}

setInterval(() => {
  launchAllProjectiles();
}, 2000);

start.onclick = () => {
  const enemies = [];

  function createEnemy() {
    const enemy = document.createElement("div");
    enemy.classList.add("enemy");
    enemy.style.top = Math.random() * 30 + 7 + "%";
    enemy.style.left = "-50px";
    enemy.style.transition = "all 0.3s linear";

    const enemyImg = document.getElementById("enemy-img");
    const enemyImgClone = enemyImg.cloneNode(true);
    enemyImgClone.style.display = "block";
    enemy.appendChild(enemyImgClone);

    document.body.appendChild(enemy);
    enemies.push(enemy);

    function moveEnemy() {
      const currentLeft = parseInt(enemy.style.left);
      const newLeft = currentLeft + 10;
      enemy.style.left = newLeft + "px";

      if (newLeft >= window.innerWidth) {
        document.body.removeChild(enemy);
        enemies.splice(enemies.indexOf(enemy), 1);
      } else {
        const projectiles = document.getElementsByClassName("projectile");
        for (let i = 0; i < projectiles.length; i++) {
          if (checkCollision(projectiles[i], enemy)) {
            document.body.removeChild(enemy);
            enemies.splice(enemies.indexOf(enemy), 1);
            document.body.removeChild(projectiles[i]);
            score++;
            document.getElementById("score").textContent = score;
          }
        }
        setTimeout(moveEnemy, 80);
      }
    }

    moveEnemy();
  }
  function checkCollision(a2, b2) {
    const aRect = a2.getBoundingClientRect();
    const bRect = b2.getBoundingClientRect();
    return !(
      aRect.bottom < bRect.top ||
      aRect.top > bRect.bottom ||
      aRect.right < bRect.left ||
      aRect.left > bRect.right
    );
  }

  setInterval(createEnemy, 500);

  menu.style.display = "none";
  document.body.style.background = "url(./res/img/battle.png)";
  player.style.display = "none";
  startmenu.style.display = "none";
  player2.style.display = "block";
  check = false;
};
