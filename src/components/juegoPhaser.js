import Phaser, { Scale } from "phaser";
export function inicializarJuego(container) {
  let level = 1;
  let playerQuantity = 1;
  let player = "";
  let secondPlayer = "";
  let stars = "";
  let booms = "";
  let scoreText = "";
  let scoreTextP2 = "";
  let goLeftP1 = false;
  let goLeftP2 = false;
  let goRightP1 = false;
  let goRightP2 = false;
  let goUpP1 = false;
  let goUpP2 = false;
  let musicStart = true;

  class MainScene extends Phaser.Scene {
    constructor() {
      super("gameScene");
    }
    preload() {
      this.load.image("jungle", "assets/jumpingMonkey/images/background.png");
      this.load.image("platform", "assets/jumpingMonkey/images/platform1.png");
      this.load.image("ground", "assets/jumpingMonkey/images/platform4.png");
      this.load.image("star", "assets/jumpingMonkey/images/star.png");
      this.load.image("bomb", "assets/jumpingMonkey/images/bomb.png");
      this.load.audio(
        "music",
        "assets/jumpingMonkey/sounds/Banana_Craziness.mp3"
      );
      this.load.audio("getStars", "assets/jumpingMonkey/sounds/Rise06.mp3");
      this.load.audio("crash", "assets/jumpingMonkey/sounds/bzzzt.wav");
      this.load.image(
        "controlsPlayer1",
        "assets/jumpingMonkey/images/Player1.png"
      );
      this.load.image(
        "controlsPlayer2",
        "assets/jumpingMonkey/images/Player2.png"
      );

      this.load.spritesheet("dude", "assets/jumpingMonkey/images/dude.png", {
        frameWidth: 32,
        frameHeight: 48,
      });
      this.load.spritesheet(
        "secondPlayer",
        "assets/jumpingMonkey/images/secondPlayer.png",
        {
          frameWidth: 32,
          frameHeight: 48,
        }
      );
    }
    refresTime = () => {
      this.gameTime--;
      this.timeTxt.setText(this.gameTime);
      if (this.gameTime === 0) {
        this.physics.pause();
        player.setTint(0xff0000);
        secondPlayer.setTint(0xff0000);
        this.time.addEvent({
          delay: 1000,
          callback: () => {
            this.scene.start("EndScene");
          },
        });
      } else {
        this.time.delayedCall(1000, this.refresTime, [], this);
      }
    };

    create() {
      if (musicStart) {
        musicStart = false;
        const music = this.sound.add("music");
        music.play({
          volume: 1,
          loop: true,
        });
      }
      this.add.image(400, 265, "jungle").setScale(2);
      var platforms = this.physics.add.staticGroup();
      platforms.create(180, 530, "ground");
      platforms.create(580, 530, "ground");
      platforms.create(800, 530, "platform");
      platforms.create(180, 500, "ground");
      platforms.create(560, 500, "ground");
      platforms.create(800, 500, "platform");

      if (level === 1) {
        platforms.create(400, 400, "ground");
        platforms.create(300, 280, "ground");
        platforms.create(50, 190, "ground");
        platforms.create(750, 160, "ground");
      } else if (level === 2) {
        platforms.create(145, 100, "ground");
        platforms.create(240, 100, "ground");
        platforms.create(280, 220, "ground");
        platforms.create(240, 320, "ground");
        platforms.create(480, 320, "ground");
        platforms.create(300, 420, "ground");
        platforms.create(520, 420, "ground");
      } else if (level === 3) {
        platforms.create(145, 100, "ground");
        platforms.create(335, 100, "ground");
        platforms.create(430, 100, "ground");
        platforms.create(240, 220, "ground");
        platforms.create(525, 220, "ground");
        platforms.create(535, 320, "ground");
        platforms.create(240, 420, "ground");
        platforms.create(715, 420, "ground");
      }

      player = this.physics.add.sprite(450, 400, "dude");
      player.setCollideWorldBounds(true);
      player.setBounce(0.2);
      this.physics.add.collider(player, platforms);
      player.score = 0;

      if (playerQuantity === 2) {
        secondPlayer = this.physics.add.sprite(500, 400, "secondPlayer");
        secondPlayer.setCollideWorldBounds(true);
        secondPlayer.setBounce(0.2);
        secondPlayer.score = 0;
        this.physics.add.collider(secondPlayer, platforms);
      }

      stars = this.physics.add.group({
        key: "star",
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 50 },
      });
      this.physics.add.collider(stars, platforms);
      const hitBoom = function (player, boom) {
        const musicCrash = this.sound.add("crash");
        musicCrash.play({
          volume: 1,
          loop: false,
        });
        if (playerQuantity === 1) {
          this.physics.pause();
          player.setTint(0xff0000);
          player.anims.play("turn");
          this.time.addEvent({
            delay: 1500,
            loop: false,
            callback: () => {
              this.scene.start("EndScene");
            },
          });
        } else {
          if (player.score - 10 <= 0) {
            player.score = 0;
          } else {
            player.score -= 10;
          }
          scoreText.setText("Score: " + player.score);
        }
      };
      booms = this.physics.add.group();
      this.physics.add.collider(booms, platforms);
      this.physics.add.collider(player, booms, hitBoom, null, this);
      stars.children.iterate(function (child) {
        child.setBounce(0.5);
      });
      function collectStar(player, stars) {
        player.score += 10;
        scoreText.setText("Score: " + player.score);
        console.log(player.score);
        colliderStarts(stars, this);
      }

      function colliderStarts(star, context) {
        const musicStar = context.sound.add("getStars");
        musicStar.play({
          volume: 1,
          loop: false,
        });
        star.disableBody(true, true);

        let activeStars = stars.getTotalUsed();

        if (activeStars === 0) {
          var bomb = booms.create(Phaser.Math.Between(0, 800), 16, "bomb");
          bomb.setBounce(1);
          bomb.setCollideWorldBounds(true);
          bomb.setVelocity(Phaser.Math.Between(-400 * level, 400 * level), 20);
          stars.children.iterate(function (child) {
            child.enableBody(true, child.x, 0, true, true);
          });
        }
      }
      this.physics.add.overlap(player, stars, collectStar, null, this);

      function collectStarPlayer2(player, stars) {
        secondPlayer.score += 10;
        scoreTextP2.setText("Score:" + secondPlayer.score);
        console.log(secondPlayer.score);
        colliderStarts(stars, this);
      }

      if (playerQuantity === 2) {
        this.gameTime = 60;
        this.timeTxt = this.add.text(350, 16, this.gameTime, {
          fontSize: "32px",
          fill: "#ffffff",
        });
        this.refresTime();
        scoreTextP2 = this.add.text(600, 16, "score:", {
          fontSize: "32px",
          fill: "#ffffff",
        });
        const hitBoomP2 = function (player, boom) {
          const musicCrash = this.sound.add("crash");
          musicCrash.play({
            volume: 1,
            loop: false,
          });

          if (player.score - 10 <= 0) {
            player.score = 0;
          } else {
            player.score -= 10;
          }
          scoreTextP2.setText("Score: " + secondPlayer.score);
        };
        this.physics.add.collider(secondPlayer, booms, hitBoomP2, null, this);
        this.physics.add.overlap(
          secondPlayer,
          stars,
          collectStarPlayer2,
          null,
          this
        );
      }

      this.anims.create({
        key: "left",
        frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1,
      });

      this.anims.create({
        key: "turn",
        frames: [{ key: "dude", frame: 4 }],
        frameRate: 10,
        repeat: -1,
      });

      this.anims.create({
        key: "right",
        frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1,
      });

      this.anims.create({
        key: "leftP2",
        frames: this.anims.generateFrameNumbers("secondPlayer", {
          start: 0,
          end: 3,
        }),
        frameRate: 10,
        repeat: -1,
      });

      this.anims.create({
        key: "turnP2",
        frames: [{ key: "secondPlayer", frame: 4 }],
        frameRate: 10,
        repeat: -1,
      });

      this.anims.create({
        key: "rightP2",
        frames: this.anims.generateFrameNumbers("secondPlayer", {
          start: 5,
          end: 8,
        }),
        frameRate: 10,
        repeat: -1,
      });
      scoreText = this.add.text(16, 16, "socore:", {
        fontSize: "32px",
        fill: "#ffffff",
      });

      // controles para movile
      if (window.screen.width <= 900) {
        this.add.image(100, 450, "controlsPlayer1").setScale(0.5);
        if (playerQuantity === 2) {
          this.add.image(700, 450, "controlsPlayer2").setScale(0.5);
          // zona flecha izquierda p1
          let leftOptionP1 = this.add.zone(15, 420, 50, 50);
          leftOptionP1.setOrigin(0);
          leftOptionP1.setInteractive();
          leftOptionP1.on("pointerdown", () => {
            goLeftP1 = true;
          });
          leftOptionP1.on("pointerup", () => {
            goLeftP1 = false;
          });
          leftOptionP1.on("pointerout", () => {
            goLeftP1 = false;
          });
          this.add
            .graphics()
            .lineStyle(2, 0x00ff00)
            .strokeRectShape(leftOptionP1);
        }
        // zona flecha derecha p1
        let rightOptionP1 = this.add.zone(130, 420, 50, 50);
        rightOptionP1.setOrigin(0);
        rightOptionP1.setInteractive();
        rightOptionP1.on("pointerdown", () => {
          goRightP1 = true;
        });
        rightOptionP1.on("pointerup", () => {
          goRightP1 = false;
        });
        rightOptionP1.on("pointerout", () => {
          goRightP1 = false;
        });
        this.add
          .graphics()
          .lineStyle(2, 0x00ff00)
          .strokeRectShape(rightOptionP1);
        //zona flecha arriba p1
        let upOptionP1 = this.add.zone(75, 390, 50, 50);
        upOptionP1.setOrigin(0);
        upOptionP1.setInteractive();
        upOptionP1.on("pointerdown", () => {
          goUpP1 = true;
        });
        upOptionP1.on("pointerup", () => {
          goUpP1 = false;
        });
        upOptionP1.on("pointerout", () => {
          goUpP1 = false;
        });
        this.add.graphics().lineStyle(2, 0x00ff00).strokeRectShape(upOptionP1);

        if (playerQuantity === 2) {
          // zona flecha izquierda p2
          let leftOptionP2 = this.add.zone(620, 420, 50, 50);
          leftOptionP2.setOrigin(0);
          leftOptionP2.setInteractive();
          leftOptionP2.on("pointerdown", () => {
            goLeftP2 = true;
          });
          leftOptionP2.on("pointerup", () => {
            goLeftP2 = false;
          });
          leftOptionP2.on("pointerout", () => {
            goLeftP2 = false;
          });
          this.add
            .graphics()
            .lineStyle(2, 0x00ff00)
            .strokeRectShape(leftOptionP2);
        } // zona flecha derecha p2
        let rightOptionP2 = this.add.zone(735, 420, 50, 50);
        rightOptionP2.setOrigin(0);
        rightOptionP2.setInteractive();
        rightOptionP2.on("pointerdown", () => {
          goRightP2 = true;
        });
        rightOptionP2.on("pointerup", () => {
          goRightP2 = false;
        });
        rightOptionP2.on("pointerout", () => {
          goRightP2 = false;
        });
        this.add
          .graphics()
          .lineStyle(2, 0x00ff00)
          .strokeRectShape(rightOptionP2);
        //zona flecha arriba p2
        let upOptionP2 = this.add.zone(675, 390, 50, 50);
        upOptionP2.setOrigin(0);
        upOptionP2.setInteractive();
        upOptionP2.on("pointerdown", () => {
          goUpP2 = true;
        });
        upOptionP2.on("pointerup", () => {
          goUpP2 = false;
        });
        upOptionP2.on("pointerout", () => {
          goUpP2 = false;
        });
        this.add.graphics().lineStyle(2, 0x00ff00).strokeRectShape(upOptionP2);
      }
    }

    update() {
      var cursors = this.input.keyboard.createCursorKeys();

      if (cursors.left.isDown || goLeftP1) {
        player.setVelocityX(-160);
        player.anims.play("left", true);
      } else if (cursors.right.isDown || goRightP1) {
        player.setVelocityX(160);
        player.anims.play("right", true);
      } else {
        player.setVelocityX(0);
        player.anims.play("turn");
      }

      if (cursors.up.isDown || (goUpP1 && player.body.touching.down)) {
        player.setVelocityY(-330);
      }

      if (playerQuantity === 2) {
        var keyObjUp = this.input.keyboard.addKey("W");
        var player2Up = keyObjUp.isDown;

        var keyObjRight = this.input.keyboard.addKey("D");
        var player2Right = keyObjRight.isDown;

        var keyObjLeft = this.input.keyboard.addKey("A");
        var player2Left = keyObjLeft.isDown;

        if (player2Left || goLeftP2) {
          secondPlayer.setVelocityX(-160);
          secondPlayer.anims.play("leftP2", true);
        } else if (player2Right || goRightP2) {
          secondPlayer.setVelocityX(160);
          secondPlayer.anims.play("rightP2", true);
        } else {
          secondPlayer.setVelocityX(0);
          secondPlayer.anims.play("turnP2");
        }

        if (player2Up || (goUpP2 && secondPlayer.body.touching.down)) {
          secondPlayer.setVelocityY(-330);
        }
      }
    }
  }
  class Menu extends Phaser.Scene {
    constructor() {
      super("Menu");
    }
    preload() {
      let progressBar = this.add.graphics();
      let width = this.cameras.main.width;
      let height = this.cameras.main.height;
      let loadingText = this.add.text(
        width / 2,
        height / 2 - 50,
        "Cargando...",
        {
          fontSize: "32px",
          fill: "#fff",
        }
      );
      let percentText = this.add.text(width / 2, height / 2 - 25, "0%", {
        fontSize: "18px",
        fill: "#fff",
      });
      let assetText = this.add.text(width / 2, height / 2 + 50, "Assets", {
        fontSize: "18px",
        fill: "#fff",
      });
      this.load.on("progress", function (value) {
        percentText.setText(parseInt(value * 100) + "%");
        progressBar.clear();
        progressBar.fillStyle(0xffffff, 1);
        progressBar.fillRect(width / 2 - 160, height / 2 - 10, value * 320, 50);
      });
      this.load.on("fileprogress", function (file) {
        assetText.setText("Cargando: " + file.key);
        console.log(file.src);
      });
      this.load.on("complete", function () {
        progressBar.destroy();
        loadingText.destroy();
        percentText.destroy();
        assetText.destroy();
      });

      this.load.image(
        "fullscrreen",
        "assets/jumpingMonkey/images/fullscreen.png"
      );
      this.load.image("buttons", "assets/jumpingMonkey/images/buttons.png");
      this.load.image(
        "background",
        "assets/jumpingMonkey/images/background.png"
      );
      this.load.image("logo", "assets/jumpingMonkey/images/JumpingMonkey.png");
      this.load.image("monkey", "assets/jumpingMonkey/images/monkey.png");
    }
    create() {
      this.add.image(480, 320, "background").setScale(2);
      const fullscreenButton = this.add.image(770, 50, "fullscrreen");
      fullscreenButton.setInteractive();
      fullscreenButton.on("pointerup", () => {
        if (this.scale.isFullscreen) {
          this.scale.stopFullscreen();
        } else {
          this.scale.startFullscreen();
        }
      });

      // Ajusta el tamaño y posición del botón según sea necesario
      fullscreenButton.setScale(0.1);
      this.add.image(380, 280, "buttons");
      this.add.image(400, 50, "logo");
      this.add.image(180, 450, "monkey");
      // zona para boton de start

      const startOption = this.add.zone(290, 80, 175, 80);
      startOption.setOrigin(0);
      startOption.setInteractive();
      this.add.graphics().lineStyle(2, 0xff0000).strokeRectShape(startOption);
      // zona boton de level
      const levelOption = this.add.zone(290, 185, 175, 80);
      levelOption.setOrigin(0);
      levelOption.setInteractive();
      this.add.graphics().lineStyle(2, 0xff0000).strokeRectShape(levelOption);
      // zona boton de mode
      const modeOption = this.add.zone(290, 290, 175, 80);
      modeOption.setOrigin(0);
      modeOption.setInteractive();
      this.add.graphics().lineStyle(2, 0xff0000).strokeRectShape(modeOption);
      // zona boton de controls
      const controlsOption = this.add.zone(290, 395, 175, 80);
      controlsOption.setOrigin(0);
      controlsOption.setInteractive();
      this.add
        .graphics()
        .lineStyle(2, 0xff0000)
        .strokeRectShape(controlsOption);
      this.redirectScene = function (sceneName) {
        this.scene.start(sceneName);
      };
      startOption.on("pointerdown", () => this.redirectScene("gameScene"));
      levelOption.on("pointerdown", () => this.redirectScene("Level"));
      modeOption.on("pointerdown", () => this.redirectScene("Mode"));
      controlsOption.on("pointerdown", () => this.redirectScene("Controls"));
      this.add.text(500, 400, "N jugadores :" + playerQuantity, {
        fontSize: "32px",
        fill: "#fff",
      });
      this.add.text(500, 450, "Dificultad: " + level, {
        fontSize: "32px",
        fill: "#fff",
      });
    }
    update() {}
  }
  class Level extends Phaser.Scene {
    constructor() {
      super("Level");
    }
    preload() {
      this.load.image("jungle", "assets/jumpingMonkey/images/background.png");
      this.load.image(
        "buttonsLevel",
        "assets/jumpingMonkey/images/levelButtons.png"
      );
    }
    create() {
      this.add.image(480, 320, "jungle").setScale(2);
      this.add.image(380, 280, "buttonsLevel");
      // zona easy
      const zonaEasy = this.add.zone(290, 80, 175, 80);
      zonaEasy.setOrigin(0);
      zonaEasy.setInteractive();
      this.add.graphics().lineStyle(2, 0xff0000).strokeRectShape(zonaEasy);
      // zona  medium
      const zonaMedium = this.add.zone(290, 185, 175, 80);
      zonaMedium.setOrigin(0);
      zonaMedium.setInteractive();
      this.add.graphics().lineStyle(2, 0xff0000).strokeRectShape(zonaMedium);
      // zona hard
      const zonaHard = this.add.zone(290, 290, 175, 80);
      zonaHard.setOrigin(0);
      zonaHard.setInteractive();
      this.add.graphics().lineStyle(2, 0xff0000).strokeRectShape(zonaHard);
      //  zona Back
      const zonaBack = this.add.zone(290, 395, 175, 80);
      zonaBack.setOrigin(0);
      zonaBack.setInteractive();
      this.add.graphics().lineStyle(2, 0xff0000).strokeRectShape(zonaBack);
      this.changeLevel = function (levelTheGame) {
        return () => {
          level = levelTheGame;
          this.scene.start("Menu");
        };
      };
      this.redirectScene = function (sceneName) {
        this.scene.start(sceneName);
      };
      zonaEasy.once("pointerdown", this.changeLevel(1));
      zonaMedium.once("pointerdown", this.changeLevel(2));
      zonaHard.once("pointerdown", this.changeLevel(3));
      zonaBack.once("pointerdown", () => this.redirectScene("Menu"));
    }

    update() {}
  }

  class Mode extends Phaser.Scene {
    constructor() {
      super("Mode");
    }
    preload() {
      this.load.image("jungle", "assets/jumpingMonkey/images/background.png");
      this.load.image("logo", "assets/jumpingMonkey/images/JumpingMonkey.png");
      this.load.image("monkey", "assets/jumpingMonkey/images/monkey.png");
      this.load.image(
        "buttonsMode",
        "assets/jumpingMonkey/images/modeButtons.png"
      );
    }
    create() {
      this.add.image(480, 320, "jungle").setScale(2);
      this.add.image(380, 280, "buttonsMode");
      // zona 1 player
      const zona1Player = this.add.zone(290, 140, 175, 80);
      zona1Player.setOrigin(0);
      zona1Player.setInteractive();
      this.add.graphics().lineStyle(2, 0xff0000).strokeRectShape(zona1Player);
      // zona 2 player
      const zona2Player = this.add.zone(290, 240, 175, 80);
      zona2Player.setOrigin(0);
      zona2Player.setInteractive();
      this.add.graphics().lineStyle(2, 0xff0000).strokeRectShape(zona2Player);
      // zona Back
      const zonaBack = this.add.zone(290, 340, 175, 80);
      zonaBack.setOrigin(0);
      zonaBack.setInteractive();
      this.add.graphics().lineStyle(2, 0xff0000).strokeRectShape(zonaBack);

      this.changeMode = function (player) {
        return () => {
          playerQuantity = player;
          this.scene.start("Menu");
        };
      };
      this.redirectScene = function (sceneName) {
        this.scene.start(sceneName);
      };
      zona1Player.once("pointerdown", this.changeMode(1));
      zona2Player.once("pointerdown", this.changeMode(2));
      zonaBack.once("pointerdown", () => this.redirectScene("Menu"));
    }
    update() {}
  }
  class Controls extends Phaser.Scene {
    constructor() {
      super("Controls");
    }
    preload() {
      this.load.image("jungle", "assets/jumpingMonkey/images/background.png");
      this.load.image("logo", "assets/jumpingMonkey/images/JumpingMonkey.png");
      this.load.image("monkey", "assets/jumpingMonkey/images/monkey.png");
      this.load.image(
        "buttonsControls",
        "assets/jumpingMonkey/images/Player1.png"
      );
      this.load.image(
        "buttonsControls2",
        "assets/jumpingMonkey/images/Player2.png"
      );
    }
    create() {
      this.add.image(480, 320, "jungle").setScale(2);
      this.add.image(400, 50, "logo");
      this.add.text(120, 100, "Player 1", {
        fontSize: "32px",
        fill: "#ffffff",
      });
      this.add.image(600, 300, "buttonsControls2");
      this.add.image(180, 300, "buttonsControls");
      this.add.text(540, 100, "Player 2", {
        fontSize: "32px",
        fill: "#ffffff",
      });
      this.redirectEscene = function (sceneName) {
        this.scene.start(sceneName);
      };
      const BackOptions = this.add.zone(0, 0, 800, 530);
      BackOptions.setOrigin(0, 0);
      BackOptions.setInteractive();
      BackOptions.once("pointerdown", () => this.redirectEscene("Menu"));
    }
    update() {}
  }
  class EndScene extends Phaser.Scene {
    constructor() {
      super("EndScene");
    }
    preload() {
      this.load.image("jungle", "assets/jumpingMonkey/images/background.png");
      this.load.image("logo", "assets/jumpingMonkey/images/JumpingMonkey.png");
      this.load.image("monkey", "assets/jumpingMonkey/images/monkey.png");
    }
    create() {
      this.add.image(480, 320, "jungle").setScale(2);
      this.add.image(400, 50, "logo");
      this.add.image(180, 450, "monkey");
      this.add.text(200, 150, "Player 1 Score: " + player.score, {
        fontSize: "32px",
        fill: "#ffffff",
      });
      this.add.text(200, 200, "Player 2 Score: " + secondPlayer.score, {
        fontSize: "32px",
        fill: "#ffffff",
      });
      this.add.text(400, 360, "Level:" + level, {
        fontSize: "32px",
        fill: "#ffffff",
      });
      this.add.text(400, 400, "Mode:" + playerQuantity + "player", {
        fontSize: "32px",
        fill: "#ffffff",
      });
      const redirectEscene = (sceneName) => {
        this.scene.start(sceneName);
      };
      const BackOptions = this.add.zone(0, 0, 800, 530);
      BackOptions.setOrigin(0, 0);
      BackOptions.setInteractive();
      BackOptions.once("pointerdown", () => redirectEscene("Menu"));
    }

    update() {}
  }
  const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 530,
    scene: [Menu, Controls, Mode, Level, MainScene, EndScene],
    parent: container,
    Scale: {
      mode: Scale.ScaleManager.AUTO,
    },
    physics: {
      default: "arcade",
      arcade: {
        debug: false,
        gravity: { y: 300 },
      },
    },
  };

  return new Phaser.Game(config);
}
