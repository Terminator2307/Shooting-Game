//// Importing Sounds 
const introSound = new Audio("./Soundeffect/introSong.mp3");
const shootingSound = new Audio("./Soundeffect/music_shoooting.mp3");
const heavyWeaponSound = new Audio("./Soundeffect/music_heavyWeapon.mp3");
const hugeWeaponSound = new Audio("./Soundeffect/music_hugeWeapon.mp3");
const killEnemySound = new Audio("./Soundeffect/music_killEnemy.mp3");
const gameOverSound = new Audio("./Soundeffect/music_gameOver.mp3");

// Playing Intro sound 
introSound.play();

// Basic Environment Setup ////////////////////
const canvas = document.createElement("canvas");
const myGame = document.querySelector(".myGame");
myGame.appendChild(canvas);
canvas.width = innerWidth;
canvas.height = innerHeight;
const context = canvas.getContext("2d");

let difficulty = 2;
const lightWeaponDamage = 10;
const heavyWeaponDamage = 20;


const form = document.querySelector(".difficultyLevel");
const scoreBoard = document.querySelector(".scoreBoard");
let playerScore = 0;
const playBtn = document.querySelector(".playBtn");

// Basic Function //////////////////////////////////////

// Event Listener for Difficulty level form //////////////////
playBtn.addEventListener("click", (e) => {
  e.preventDefault();

  // pause intro music 
  introSound.pause();

  //making form invisible
  form.style.display = "none";

  //making score board visible
  scoreBoard.style.display = "block";

  // selected difficutly level
  const userValue = document.getElementById("difficulty").value;
  if (userValue == "Easy") {
    setInterval(spawnEnemy, 2000);
    difficulty = 4;
  }
  if (userValue == "Medium") {
    setInterval(spawnEnemy, 1500);
    difficulty = 6;
  }
  if (userValue == "Hard") {
    setInterval(spawnEnemy, 1000);
    difficulty = 9;
  }
  if (userValue == "Insane") {
    setInterval(spawnEnemy, 600);
    difficulty = 11;
  }
});


///--------------------Game Over Banner --------------------------------

const gameOverLoader = () => {

    const gameOverBanner = document.querySelector(".gameOverBanner");
    const highScore =  document.querySelector(".highScore");
    const playAgainBtn = document.querySelector(".playAgainBtn");

    gameOverBanner.style.display = "flex";
    highScore.innerHTML = `High Score : ${
        localStorage.getItem("highScore") ? localStorage.getItem("highScore") : playerScore
    }`;

    const oldHighScore = localStorage.getItem("highScore") && localStorage.getItem("highScore");
    if(oldHighScore < playerScore){
        localStorage.setItem("highScore" , playerScore);

        highScore.innerHTML = `High Score : ${playerScore}`;
    }
    
    playAgainBtn.addEventListener("click",(e) =>{
        window.location.reload();
    })
}



















// player position at the center
const playerPosition = {
  x: canvas.width / 2,
  y: canvas.height / 2,
};

// Creating Player Class ////////////////
class Player {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  }

  draw() {
    context.beginPath();
    context.arc(
      this.x,
      this.y,
      this.radius,
      (Math.PI / 180) * 0,
      (Math.PI / 180) * 360,
      false
    );
    context.fillStyle = this.color;
    context.fill();
  }
}

/// Creating Weapon Class  ////////////////////////////////////////////////

class Weapon {
  constructor(x, y, radius, color, velocity,damage) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.damage = damage;
  }

  draw() {
    context.beginPath();
    context.arc(
      this.x,
      this.y,
      this.radius,
      (Math.PI / 180) * 0,
      (Math.PI / 180) * 360,
      false
    );
    context.fillStyle = this.color;
    context.fill();
  }
  update() {
    this.draw();
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }
}

// ---------------------Creating huge weapon ---------------------------
class HugeWeapon {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.color = 'rgb(186, 252, 3)';

  }

  draw() {
    context.beginPath();
    context.fillStyle = this.color;
    context.fillRect(this.x , this.y, 70 , canvas.height);
    context.fill();
  }
  update() {
    this.draw();
    this.x += 10;
  }
}

/// Creating Enemy Class ///////////////////////////////////////////////////////////

class Enemy {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }

  draw() {
    context.beginPath();
    context.arc(
      this.x,
      this.y,
      this.radius,
      (Math.PI / 180) * 0,
      (Math.PI / 180) * 360,
      false
    );
    context.fillStyle = this.color;
    context.fill();
  }
  update() {
    this.draw();
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }
}

///--------------------- Creating Particle class ----------------------
const fraction = 0.99;
class Particle {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.alpha = 1.5;
  }

  draw() {
    context.save();
    context.globalAlpha = this.alpha;
    context.beginPath();
    context.arc(
      this.x,
      this.y,
      this.radius,
      (Math.PI / 180) * 0,
      (Math.PI / 180) * 360,
      false
    );
    context.fillStyle = this.color;
    context.fill();
    context.restore();
  }
  update() {
    this.draw();
    this.velocity.x *= fraction;
    this.velocity.y *= fraction;

    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.alpha -= 0.01;
  }
}

// Main login heree ////////////////////////////

// Creating player object and  weapons , enemies array etc
const rahul = new Player(playerPosition.x, playerPosition.y, 15, "white");

const weapons = [];
const enemies = [];
const particles = [];
const hugeWeapons = [];

// Function to Spawn Enemy at Random Location
const spawnEnemy = () => {
  // Generating random size of enemy
  const enemySize = Math.random() * (40 - 5) + 5;

  // Generating random color of enemy
  const enemyColor = `hsl(${Math.floor(Math.random() * 360)} ,100% , 50%)`;

  // random is Energy Spawn position
  let random;

  //Making Energy Location random but only from outsize of screen
  if (Math.random() < 0.5) {
    // making x equal to very left off screen or very right off of screen and setting Y to any where vertically
    random = {
      x: Math.random() < 0.5 ? canvas.width + enemySize : 0 - enemySize,
      y: Math.random() * canvas.height,
    };
  } else {
    // making y equal to very top off screen or very bottom off of screen and setting X to any where horizontally
    random = {
      y: Math.random() < 0.5 ? canvas.height + enemySize : 0 - enemySize,
      x: Math.random() * canvas.width,
    };
  }

  // direct the enemy direction  towards weapon
  const myAngle = Math.atan2(
    playerPosition.y - random.y,
    playerPosition.x - random.x
  );
  const velocity = {
    x: Math.cos(myAngle) * difficulty,
    y: Math.sin(myAngle) * difficulty,
  };

  //adding enemy to enemies array
  enemies.push(new Enemy(random.x, random.y, enemySize, enemyColor, velocity));
};

// ------------------Creating  Animation function ----------------//
function animation() {
  //making recursion
  const animationId = requestAnimationFrame(animation);

  
    // updating player score on score borad
    scoreBoard.innerHTML = `Score : ${playerScore}`;


  // clearing canvas on each frame
  //   context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "rgb(49 ,49, 49,0.2)";
  context.fillRect(0, 0, canvas.width, canvas.height);

  // drawing player
  rahul.draw();

  // generatinng particles
  particles.forEach((particle, particleIndex) => {
      if(particle.alpha <= 0){
          particles.splice(particleIndex , 1);
      }
    particle.update();
  });

  // generating huge weapons
  hugeWeapons.forEach((hugeweapon , hugeweaponIndex) => {
      
      // removing hugeweapon which goes out side of screen
      if(hugeweapon.x  > canvas.width){
          hugeWeapons.splice(hugeweaponIndex , 1);
      }
      else {
        hugeweapon.update();
      }
  });


  // generatin bullets
  weapons.forEach((weapon, weaponIndex) => {
    weapon.update();

    // removing bullets which goes outside of sreen
    if (
      weapon.x + weapon.radius < 1 ||
      weapon.y + weapon.radius < 1 ||
      weapon.x - weapon.radius > canvas.width ||
      weapon.y - weapon.radius > canvas.height
    ) {
      weapons.splice(weaponIndex, 1);
    }
  });

  // generating enemies
  enemies.forEach((enemy, enemyIndex) => {
    enemy.update();

    // final distance between player and enemy
    const distBetweentPlayerAndEnemy = Math.hypot(
      rahul.x - enemy.x,
      rahul.y - enemy.y
    );

    // Game Over condition
    if (distBetweentPlayerAndEnemy - enemy.radius - rahul.radius < 1) {
      cancelAnimationFrame(animationId);
      gameOverSound.play();
      return gameOverLoader();
    }

    hugeWeapons.forEach((hugeweapon) => {

        // Finding distance between huge Weapon and enemy
        const distBetweentHugeweaponAndEnemy = enemy.x - hugeweapon.x;

        if(distBetweentHugeweaponAndEnemy <= 70 ){

            // increasing player score when killing one enemy
            playerScore += 10;
            setTimeout(() => {
                enemies.splice(enemyIndex, 1);
              }, 0);
        }
    });

    weapons.forEach((weapon, weaponIndex) => {
      /// distance between bullet and enemy
      const distBetweentBulletAndEnemy = Math.hypot(
        weapon.x - enemy.x,
        weapon.y - enemy.y
      );

      if (distBetweentBulletAndEnemy - enemy.radius - weapon.radius < 1) {
        // removing enemy and bullet when they collide

        // reducing size of enemy
        if (enemy.radius > weapon.damage + 8) {
          gsap.to(enemy, {
            radius: enemy.radius - weapon.damage,
          });

          setTimeout(() => {
            // adding killing enemy sound effect
            killEnemySound.play();
            
            //removing collided  enemy
            weapons.splice(weaponIndex, 1);
          }, 0);
        }

        // removing enemy and weapon when  enemy size is less than 18
        else {
          for (let i = 0; i < enemy.radius * 2; i++) {
            particles.push(
              new Particle(weapon.x, weapon.y, Math.random()*2 , enemy.color, {
                x: (Math.random() - 0.5) * Math.random()*10,
                y: (Math.random() - 0.5) * Math.random()*10,
              })
            );
          }

          // increasing +10 player score when killing one enemy
          
          setTimeout(() => {
              // adding killing enemy sound effect
              killEnemySound.play();

              //removing collided weapon and enemy
              enemies.splice(enemyIndex, 1);
              weapons.splice(weaponIndex, 1);
            }, 0);

            playerScore += 10;
  
            // Rendering  player score in scoreboard html element
            scoreBoard.innerHTML = `Score : ${playerScore}`;
        }
      }
    });
  });
}

// ------------------------Adding event Listener ---------------------//

// event listener for light weapon aka left click
canvas.addEventListener("click", (e) => {
    e.preventDefault();

    // adding shooting sound effect
    shootingSound.play();

    // console.log(e.clientX , e.clientY);
  const myAngle = Math.atan2(
    e.clientY - playerPosition.y,
    e.clientX - playerPosition.x
  );
  const velocity = {
    x: Math.cos(myAngle) * 6,
    y: Math.sin(myAngle) * 6,
  };

  // adding light weapon in weapons array
  weapons.push(
    new Weapon(playerPosition.x, playerPosition.y, 6, "white", velocity,lightWeaponDamage)
  );
});


// event listener for heavy weapon aka right click
canvas.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    
    // condition if playerscore<=0 then you cant use heavy weapon
    if(playerScore <= 0){
        return;
    }

    // adding heavy weapon sound effect
    heavyWeaponSound.play();

    // Decreasing player score for using heavy weapong 
    playerScore -= 5;

    // updating player score on score borad
    scoreBoard.innerHTML = `Score : ${playerScore}`;


  const myAngle = Math.atan2(
    e.clientY - playerPosition.y,
    e.clientX - playerPosition.x
  );
  const velocity = {
    x: Math.cos(myAngle) * 4,
    y: Math.sin(myAngle) * 4,
  };

  // adding light weapon in weapons array
  weapons.push(
    new Weapon(playerPosition.x, playerPosition.y, 17, "cyan", velocity,heavyWeaponDamage)
  );
});

// event listener for huge weapon aka space bar
addEventListener("keypress" , (e) => {
    e.preventDefault();
   
    if(e.key === " "){
        
        // condition if playerscore<=0 then you cant use huge weapon
        if(playerScore <= 30){
            return;
        }

    // adding huge weaponsound effect
    hugeWeaponSound.play();

    // Decreasing player score for using huge weapong 
    playerScore -= 30;

    // updating player score on score borad
    scoreBoard.innerHTML = `Score : ${playerScore}`;

        hugeWeapons.push(new HugeWeapon(0 , 0 ));
    }
});


addEventListener("contextmenu" , (e) => {
    e.preventDefault();
});


addEventListener("resize" , (e) => {
    // canvas.width = innerWidth;
    // canvas.height = innerHeight;
    window.location.reload();
});

animation();
