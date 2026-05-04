import { GameState } from "../state/GameState.js";

export default class Enemy {

    constructor(scene, x, y, texture, speed, hp = 1) {

    this.scene = scene;

    // 👇 si recibe textura → usa sprite
    if (typeof texture === "string") {

        this.sprite = scene.physics.add.sprite(x, y, texture, 0);
        this.sprite.setScale(0.35);

    } else {
        // fallback viejo (para otros enemigos)
        this.sprite = scene.add.rectangle(x, y, 30, 30, texture);
        scene.physics.add.existing(this.sprite);
    }

    this.sprite.enemy = this;
    this.sprite.isBoss = false;

    this.speed = speed;
    this.hp = hp;

    scene.zombies.add(this.sprite);
}

    update(player) {

    const dx = player.x - this.sprite.x;
    const dy = player.y - this.sprite.y;

    this.scene.physics.moveToObject(
        this.sprite,
        player,
        this.speed
    );

    // 👇 SOLO si es sprite (no rectángulo)
    if (this.sprite.setFrame) {

        if (Math.abs(dx) > Math.abs(dy)) {

            // izquierda / derecha
            this.sprite.setFrame(dx > 0 ? 3 : 2);

        } else {

            // arriba / abajo
            this.sprite.setFrame(dy > 0 ? 0 : 1);
        }
    }
    // 👇 ACÁ VA LA VIBRACIÓN
    this.sprite.x += Phaser.Math.Between(-1, 1);
    this.sprite.y += Phaser.Math.Between(-1, 1);
}

    damage(amount = 1) {

        this.hp -= amount;

        if (this.hp <= 0) {
            this.dropItem();
            this.sprite.destroy();
        }
    }
    dropItem() {

    const r = Math.random();

    const x = this.sprite.x;
    const y = this.sprite.y;

    // 40% nada
    if (r < 0.4) return;

    // 30% balas pistola
    if (r < 0.7) {

        const ammo = this.scene.add.rectangle(x, y, 10, 10, 0xffffff);

        this.scene.physics.add.existing(ammo, true);

        this.scene.physics.add.overlap(
            this.scene.player.sprite,
            ammo,
            () => {

                GameState.magazine =
                    Math.min(
                        GameState.magazine + 3,
                        GameState.maxMagazine
                    );

                ammo.destroy();
            }
        );

        return;
    }

    // 20% shells shotgun
    if (r < 0.9) {

        const shells = this.scene.add.rectangle(x, y, 10, 10, 0xffaa00);

        this.scene.physics.add.existing(shells, true);

        this.scene.physics.add.overlap(
            this.scene.player.sprite,
            shells,
            () => {

                GameState.shotgunAmmo =
                    Math.min(
                        GameState.shotgunAmmo + 2,
                        GameState.shotgunMaxAmmo
                    );

                shells.destroy();
            }
        );

        return;
    }

    // 10% medkit
    const medkit = this.scene.add.rectangle(x, y, 12, 12, 0x00ff88);

    this.scene.physics.add.existing(medkit, true);

    medkit.taken = false;

    this.scene.physics.add.overlap(
        this.scene.player.sprite,
        medkit,
        () => {

            if (medkit.taken) return;
            medkit.taken = true;

            GameState.hp = Math.min(
                GameState.hp + 30,
                GameState.maxHp
            );

            medkit.destroy();
        }
    );
    }

}