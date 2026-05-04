import BaseScene from "./BaseScene.js";
import { GameState } from "../state/GameState.js";

export default class KeyRoom extends BaseScene {

    constructor() {
        super("KeyRoom");
    }

    create() {

        // 1. fondo primero
        this.add.image(400, 300, "bg_key")
            .setScale(0.56)
            .setDepth(-1000);

        // 2. mundo / player / UI
        this.createCommon(0x223322);

        this.bossAlive = !GameState.hasFinalKey;
        this.keySpawned = false;

        // zombies comunes
        this.time.addEvent({
            delay: 1500,
            loop: true,
            callback: () => this.spawnZombie(70)
        });

        // boss inicial
        if (this.bossAlive) {
            this.spawnBoss();
        }

        this.makeExit();
    }

spawnBoss() {

    const boss = this.add.rectangle(400, 220, 60, 60, 0xaa0000);

    this.physics.add.existing(boss);
    this.zombies.add(boss);

    boss.speed = 45;
    boss.isBoss = true;

    // 🔥 asegurar colisiones correctas
    boss.body.setCollideWorldBounds(true);
    boss.body.setSize(60, 60);
    boss.body.setOffset(0, 0);

    // 👇 conexión con sistema global de daño
    boss.enemy = {
        hp: 5,

        damage: (amount) => {

            boss.enemy.hp -= amount;

            // DEBUG (opcional, podés borrar después)
            console.log("HP BOSS:", boss.enemy.hp);

            if (boss.enemy.hp <= 0) {
                this.killBoss();
            }
        },

        update: (player) => {
            this.physics.moveToObject(boss, player, boss.speed);
        }
    };

    this.boss = boss;
}

    makeExit() {

    this.exitDoor = this.add.rectangle(
        40,
        300,
        40,
        80,
        0xff0000
    );

    this.physics.add.existing(this.exitDoor, true);
}

    updateZombies() {

        this.zombies.getChildren().forEach(z => {

            this.physics.moveToObject(
                z,
                this.player.sprite,
                z.speed
            );
        });
    }

    createCommonOverride() {

    }

   update() {

    this.player.update();
    this.updateZombies();

    // 👇 chequeo manual puerta
    if (
        this.exitDoor &&
        this.player.sprite &&
        Phaser.Geom.Intersects.RectangleToRectangle(
            this.player.sprite.getBounds(),
            this.exitDoor.getBounds()
        )
    ) {

        // solo salir si boss está muerto
        if (!this.boss || !this.boss.active) {

            GameState.nextSpawnX = 720;
            GameState.nextSpawnY = 300;

            this.scene.start("Hub");
        }
    }

    let extra = "";

    if (!GameState.hasFinalKey) {
        extra = "\nBusca la llave final";
    } else {
        extra = "\nLlave conseguida!";
    }

    this.updateUI("KEY ROOM");
    this.ui.setText(this.ui.text + extra);
}

    killBoss() {

        this.bossAlive = false;

        if (this.boss) {
            this.boss.destroy();
        }

        this.spawnFinalKey();
    }

    spawnFinalKey() {

        if (this.keySpawned) return;

        this.keySpawned = true;

        this.finalKey = this.add.rectangle(
            400,
            220,
            22,
            22,
            0xffff00
        );

        this.physics.add.existing(this.finalKey, true);

        this.physics.add.overlap(
            this.player.sprite,
            this.finalKey,
            () => {

                GameState.hasFinalKey = true;
                this.finalKey.destroy();

            }
        );
    }
}