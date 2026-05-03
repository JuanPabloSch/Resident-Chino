import { GameState } from "../state/GameState.js";

export default class PlayerSystem {

    constructor(scene, x, y) {

        this.scene = scene;

        this.sprite = scene.add.rectangle(
            x,
            y,
            30,
            30,
            0x00ff00
        );

        scene.physics.add.existing(this.sprite);

        this.sprite.body.setCollideWorldBounds(true);

        this.keys = scene.input.keyboard.createCursorKeys();

        this.reloading = false;
        this.canTakeDamage = true;

        scene.input.on("pointerdown", (pointer) => {
            this.shoot(pointer.worldX, pointer.worldY);
        });
    }

    update() {
        this.move();
    }

    move() {

        const speed = 180;
        const body = this.sprite.body;

        body.setVelocity(0);

        if (this.keys.left.isDown) {
            body.setVelocityX(-speed);
        } else if (this.keys.right.isDown) {
            body.setVelocityX(speed);
        }

        if (this.keys.up.isDown) {
            body.setVelocityY(-speed);
        } else if (this.keys.down.isDown) {
            body.setVelocityY(speed);
        }
    }

    shoot(x, y) {

        if (this.reloading) return;

        if (GameState.magazine <= 0) {
            this.reload();
            return;
        }

        GameState.magazine--;

        const bullet = this.scene.add.circle(
            this.sprite.x,
            this.sprite.y,
            5,
            0xffff00
        );

        this.scene.physics.add.existing(bullet);
        this.scene.bullets.add(bullet);

        const angle = Phaser.Math.Angle.Between(
            this.sprite.x,
            this.sprite.y,
            x,
            y
        );

        const speed = 500;

        bullet.body.setVelocity(
            Math.cos(angle) * speed,
            Math.sin(angle) * speed
        );

        this.scene.time.delayedCall(2000, () => {
            if (bullet.active) bullet.destroy();
        });
    }

    reload() {

        this.reloading = true;

        this.scene.time.delayedCall(1200, () => {

            GameState.magazine = GameState.maxMagazine;
            this.reloading = false;

        });
    }

    damage(amount) {

        if (!this.canTakeDamage) return;

        this.canTakeDamage = false;

        GameState.hp -= amount;

        if (GameState.hp < 0) {
            GameState.hp = 0;
        }

        this.scene.time.delayedCall(600, () => {
            this.canTakeDamage = true;
        });

        if (GameState.hp <= 0) {
            this.scene.scene.restart();
        }
    }
}