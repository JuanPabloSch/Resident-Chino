import BaseScene from "./BaseScene.js";
import { GameState } from "../state/GameState.js";

export default class Hub extends BaseScene {

    constructor() {
        super("Hub");
    }

    create() {

        // 1. fondo PRIMERO
    this.add.image(400, 300, "bg_hub").setDepth(-1000).setScale(0.56);;

    // 2. mundo encima
    this.createCommon(0x2a2a2a);

        // zombies leves
        this.time.addEvent({
            delay: 1800,
            loop: true,
            callback: () => this.spawnZombie(50)
        });

        // -------------------------
        // PUERTAS ROOMS
        // -------------------------

        // arriba -> Lockdown
        this.makeDoor(400, 40, () => {
            GameState.nextSpawnX = 400;
            GameState.nextSpawnY = 520;
            this.scene.start("LockdownRoom");
        });

        // izquierda -> Button
        this.makeDoor(40, 300, () => {
            GameState.nextSpawnX = 720;
            GameState.nextSpawnY = 300;
            this.scene.start("ButtonRoom");
        });

        // derecha -> KeyRoom
        this.makeDoor(760, 300, () => {
            GameState.nextSpawnX = 80;
            GameState.nextSpawnY = 300;
            this.scene.start("KeyRoom");
        });

        // -------------------------
        // SALIDA FINAL ABAJO
        // -------------------------
        this.makeExitDoor();
    }

    makeDoor(x, y, callback) {

        const door = this.add.rectangle(
            x, y, 50, 50, 0x00ffff
        );

        this.physics.add.existing(door, true);

        this.physics.add.overlap(
            this.player.sprite,
            door,
            callback
        );
    }

    makeExitDoor() {

        const color = GameState.hasFinalKey
            ? 0x00ff00
            : 0xff0000;

        this.exitDoor = this.add.rectangle(
            400,
            560,
            80,
            30,
            color
        );

        this.physics.add.existing(
            this.exitDoor,
            true
        );

        this.physics.add.overlap(
            this.player.sprite,
            this.exitDoor,
            () => {

                if (GameState.hasFinalKey) {
                    this.winGame();
                }

            }
        );
    }

    winGame() {

        this.scene.pause();

        this.add.rectangle(
            400,
            300,
            500,
            220,
            0x000000,
            0.9
        );

        this.add.text(
            285,
            250,
            "ESCAPASTE",
            {
                fontSize: "40px",
                fill: "#00ff00"
            }
        );

        this.add.text(
            250,
            320,
            "Resident Chino Complete",
            {
                fontSize: "24px",
                fill: "#ffffff"
            }
        );
    }

    update() {

        this.player.update();
        this.updateZombies();

        let extra = "";

        if (GameState.hasFinalKey) {
            extra = "\nSalida desbloqueada abajo!";
        } else {
            extra = "\nBusca la llave final";
        }

        this.updateUI("HUB");
        this.ui.setText(this.ui.text + extra);
    }
}