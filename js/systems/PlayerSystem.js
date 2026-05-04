import { GameState } from "../state/GameState.js";

export default class PlayerSystem {

    constructor(scene, x, y) {

        this.scene = scene;
        this.walkTimer = 0;
        this.walkOffset = 0;
        this.isMoving = false;
        this.sprite = scene.physics.add.sprite(x, y, "player", 0);

        this.sprite.setScale(0.3);
        this.sprite.setCollideWorldBounds(true);

        scene.physics.add.existing(this.sprite);
        this.sprite.body.setCollideWorldBounds(true);

        this.cursors = scene.input.keyboard.createCursorKeys();

        this.keys = scene.input.keyboard.createCursorKeys();
        this.qKey = scene.input.keyboard.addKey(
            this.qKey = scene.input.keyboard.addKey("Q")
        );

        scene.input.keyboard.resetKeys();

        this.reloading = false;
        this.canTakeDamage = true;

        // click izquierdo
        scene.input.mouse.disableContextMenu();

        scene.input.on("pointerdown", (pointer) => {

            if (pointer.rightButtonDown()) {
                this.reload();
                return;
            }

            this.shoot(pointer.worldX, pointer.worldY);

        });
    }


update() {

    let vx = 0;
    let vy = 0;

    if (this.cursors.left.isDown) vx = -1;
    if (this.cursors.right.isDown) vx = 1;
    if (this.cursors.up.isDown) vy = -1;
    if (this.cursors.down.isDown) vy = 1;

    const speed = 120;

    this.sprite.setVelocity(vx * speed, vy * speed);

    this.isMoving = vx !== 0 || vy !== 0;

    // 🎯 animación de dirección
    if (Math.abs(vx) > Math.abs(vy)) {
        this.sprite.setFrame(vx > 0 ? 3 : 2);
    } else {
        this.sprite.setFrame(vy > 0 ? 0 : 1);
    }

    // 👇 vibración controlada
    if (this.isMoving) {
        this.walkTimer += 0.1;

        this.walkOffset = Math.sin(this.walkTimer) * 0.3;

        this.sprite.y += this.walkOffset;
    } else {
        // volver suave al centro
        this.sprite.y -= this.walkOffset * 0.2;
        this.walkOffset *= 0.8;
    }

    this.sprite.setDepth(this.sprite.y);
}

move() {

    const speed = 180;
    const body = this.sprite.body;

    let vx = 0;
    let vy = 0;

    body.setVelocity(0);

    if (this.keys.left.isDown) vx = -1;
    else if (this.keys.right.isDown) vx = 1;

    if (this.keys.up.isDown) vy = -1;
    else if (this.keys.down.isDown) vy = 1;

    body.setVelocity(vx * speed, vy * speed);

    // 👇 detectar movimiento
    const moving = vx !== 0 || vy !== 0;

    // 👇 vibración
    if (moving) {
        this.sprite.x += Phaser.Math.Between(-0.5, 0.5);
        this.sprite.y += Phaser.Math.Between(-0.5, 0.5);
    }
}

    weaponSwitch() {

    if (Phaser.Input.Keyboard.JustDown(this.qKey)) {

        if (!GameState.hasShotgun) return;

        if (GameState.weapon === "pistol") {
            GameState.weapon = "shotgun";
        } else {
            GameState.weapon = "pistol";
        }

        console.log("Arma:", GameState.weapon);
    }
}

    shoot(x, y) {

        if (this.reloading) return;

        if (GameState.weapon === "pistol") {
            this.shootPistol(x, y);
        }
        else {
            this.shootShotgun(x, y);
        }
    }

    shootPistol(x, y) {

        if (GameState.magazine <= 0) {
            this.reload();
            return;
        }

        GameState.magazine--;

        this.fireBullet(x, y, 0);
    }

    shootShotgun(x, y) {

        if (GameState.shotgunAmmo <= 0) return;

        GameState.shotgunAmmo--;

        this.fireBullet(x, y, -0.18);
        this.fireBullet(x, y, 0);
        this.fireBullet(x, y, 0.18);
    }

    fireBullet(x, y, spread) {

        const bullet = this.scene.add.circle(
            this.sprite.x,
            this.sprite.y,
            5,
            0xffff00
        );

        this.scene.physics.add.existing(bullet);
        this.scene.bullets.add(bullet);

        const angle =
            Phaser.Math.Angle.Between(
                this.sprite.x,
                this.sprite.y,
                x,
                y
            ) + spread;

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

        if (this.reloading) return;

        if (GameState.weapon !== "pistol") return;

        this.reloading = true;

        this.scene.time.delayedCall(1200, () => {

            GameState.magazine =
                GameState.maxMagazine;

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