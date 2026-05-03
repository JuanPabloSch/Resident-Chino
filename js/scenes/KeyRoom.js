import BaseScene from "./BaseScene.js";
import { GameState } from "../state/GameState.js";

export default class KeyRoom extends BaseScene {

    constructor() {
        super("KeyRoom");
    }

    create() {

        this.createCommon(0x555522);

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

        this.bossHp = 12;

        this.boss = this.add.rectangle(
            400,
            220,
            60,
            60,
            0xaa0000
        );

        this.physics.add.existing(this.boss);
        this.zombies.add(this.boss);

        this.boss.speed = 45;
        this.boss.isBoss = true;
    }

    makeExit() {

        const door = this.add.rectangle(
            40,
            300,
            40,
            80,
            0xffffff
        );

        this.physics.add.existing(door, true);

        this.physics.add.overlap(
            this.player.sprite,
            door,
            () => {

                GameState.nextSpawnX = 720;
                GameState.nextSpawnY = 300;

                this.scene.start("Hub");
            }
        );
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

        // daño boss personalizado
        this.bullets.getChildren().forEach(bullet => {

            if (this.bossAlive && this.boss && bullet.active) {

                if (Phaser.Geom.Intersects.RectangleToRectangle(
                    bullet.getBounds(),
                    this.boss.getBounds()
                )) {

                    bullet.destroy();

                    this.bossHp--;

                    if (this.bossHp <= 0) {
                        this.killBoss();
                    }
                }
            }
        });

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