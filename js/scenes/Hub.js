import BaseScene from "./BaseScene.js";
import { GameState } from "../state/GameState.js";

export default class Hub extends BaseScene {

    constructor() {
        super("Hub");
    }

    create() {

        this.createCommon(0x2a2a2a);

        this.time.addEvent({
            delay: 1800,
            loop: true,
            callback: () => this.spawnZombie(50)
        });

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

        // derecha -> Key
        this.makeDoor(760, 300, () => {
            GameState.nextSpawnX = 80;
            GameState.nextSpawnY = 300;
            this.scene.start("KeyRoom");
        });
    }

    makeDoor(x, y, callback) {

        const door = this.add.rectangle(x, y, 50, 50, 0x00ffff);

        this.physics.add.existing(door, true);

        this.physics.add.overlap(
            this.player.sprite,
            door,
            callback
        );
    }

    update() {
        this.player.update();
        this.updateZombies();
        this.updateUI("HUB");
    }
}