import BaseScene from "./BaseScene.js";
import { GameState } from "../state/GameState.js";

export default class LockdownRoom extends BaseScene {

    constructor() {
        super("LockdownRoom");
    }

    create() {

        this.createCommon(0x552222);

        this.medkitTaken = false;

        // -------------------------
        // SI YA FUE SUPERADA
        // -------------------------
        if (GameState.lockdownSolved) {
            this.locked = false;
            this.timeLeft = 0;
        } else {
            this.locked = true;
            this.timeLeft = 15;
        }

        // -------------------------
        // ZOMBIES
        // -------------------------
        this.time.addEvent({
            delay: 1000,
            loop: true,
            callback: () => {
                this.spawnZombie(75);
            }
        });

        // -------------------------
        // PUERTA
        // -------------------------
        this.door = this.add.rectangle(
            400,
            560,
            70,
            30,
            this.locked ? 0xff0000 : 0x00ff00
        );

        this.physics.add.existing(this.door, true);

        this.physics.add.overlap(
            this.player.sprite,
            this.door,
            () => {

                if (!this.locked) {

                    GameState.nextSpawnX = 400;
                    GameState.nextSpawnY = 80;

                    this.scene.start("Hub");
                }

            }
        );

        // -------------------------
        // TIMER SOLO PRIMERA VEZ
        // -------------------------
        if (this.locked) {

            this.timerEvent = this.time.addEvent({
                delay: 1000,
                loop: true,
                callback: () => {

                    this.timeLeft--;

                    if (this.timeLeft <= 0) {
                        this.unlockDoor();
                    }

                }
            });
        }
    }

    unlockDoor() {

        this.locked = false;
        GameState.lockdownSolved = true;

        this.door.fillColor = 0x00ff00;

        if (this.timerEvent) {
            this.timerEvent.remove(false);
        }

        this.spawnMedkit();
    }

    spawnMedkit() {

        if (this.medkitTaken) return;

        this.medkit = this.add.rectangle(
            400,
            260,
            26,
            26,
            0x00ff88
        );

        this.physics.add.existing(this.medkit, true);

        this.physics.add.overlap(
            this.player.sprite,
            this.medkit,
            () => {

                GameState.hp += 40;

                if (GameState.hp > GameState.maxHp) {
                    GameState.hp = GameState.maxHp;
                }

                this.medkitTaken = true;
                this.medkit.destroy();

            }
        );
    }

    update() {

        this.player.update();
        this.updateZombies();

        let extra = "";

        if (this.locked) {
            extra = "\nSobrevive: " + this.timeLeft;
        }
        else if (!this.medkitTaken) {
            extra = "\nBotiquin disponible";
        }
        else {
            extra = "\nPuerta abierta!";
        }

        this.updateUI("LOCKDOWN");
        this.ui.setText(this.ui.text + extra);
    }
}