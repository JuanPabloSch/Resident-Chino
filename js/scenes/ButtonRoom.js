import BaseScene from "./BaseScene.js";
import { GameState } from "../state/GameState.js";

export default class ButtonRoom extends BaseScene {

    constructor() {
        super("ButtonRoom");
    }

    create() {

        this.createCommon(0x224455);

        // -------------------------
        // ESTADO GLOBAL
        // -------------------------
        if (GameState.buttonSolved === undefined) {
            GameState.buttonSolved = false;
        }

        // -------------------------
        // ROOM STATE
        // -------------------------
        this.started = false;

        if (GameState.buttonSolved) {
            this.locked = false;
            this.timeLeft = 0;
        } else {
            this.locked = true;
            this.timeLeft = 10;
        }

        // -------------------------
        // ZOMBIES BASE
        // -------------------------
        this.time.addEvent({
            delay: 1300,
            loop: true,
            callback: () => {
                this.spawnZombie(65);
            }
        });

        // -------------------------
        // BOTÓN CENTRAL
        // -------------------------
        if (!GameState.buttonSolved) {

            this.button = this.add.rectangle(
                400,
                300,
                40,
                40,
                0xffff00
            );

            this.physics.add.existing(this.button, true);

            this.physics.add.overlap(
                this.player.sprite,
                this.button,
                () => {

                    if (!this.started) {
                        this.activateButton();
                    }

                }
            );
        }

        // -------------------------
        // PUERTA SALIDA
        // -------------------------
        this.door = this.add.rectangle(
            760,
            300,
            40,
            90,
            this.locked ? 0xff0000 : 0x00ff00
        );

        this.physics.add.existing(this.door, true);

        this.physics.add.overlap(
            this.player.sprite,
            this.door,
            () => {

                if (!this.locked) {
                    GameState.nextSpawnX = 80;
                    GameState.nextSpawnY = 300;
                    this.scene.start("Hub");
                }

            }
        );
    }

    activateButton() {

        this.started = true;

        if (this.button) {
            this.button.fillColor = 0xff8800;
        }

        // timer
        this.timerEvent = this.time.addEvent({
            delay: 1000,
            loop: true,
            callback: () => {

                this.timeLeft--;

                // más presión mientras espera
                this.spawnZombie(75);

                if (this.timeLeft <= 0) {
                    this.unlockDoor();
                }

            }
        });
    }

    unlockDoor() {

    this.locked = false;
    GameState.buttonSolved = true;

    // REWARD
    GameState.hasShotgun = true;
    GameState.shotgunAmmo = 6;

    this.door.fillColor = 0x00ff00;

    if (this.button) {
        this.button.destroy();
    }

    if (this.timerEvent) {
        this.timerEvent.remove(false);
    }
}

    update() {

        this.player.update();
        this.updateZombies();

        let extra = "";

        if (GameState.buttonSolved) {
            extra = "\nSistema activado.";
        }
        else if (!this.started) {
            extra = "\nActiva el boton";
        }
        else if (this.locked) {
            extra = "\nEspera: " + this.timeLeft;
        }
        else {
            extra = "\nPuerta abierta!";
        }

        this.updateUI("BUTTON ROOM");
        this.ui.setText(this.ui.text + extra);
    }
}