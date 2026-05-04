import PlayerSystem from "../systems/PlayerSystem.js";
import { GameState } from "../state/GameState.js";
import Zombie from "../enemies/Zombie.js";
import FastZombie from "../enemies/FastZombie.js";
import TankZombie from "../enemies/TankZombie.js";
import BossZombie from "../enemies/BossZombie.js";

export default class BaseScene extends Phaser.Scene {

    constructor(key) {
        super(key);
    }

    createCommon(backgroundColor) {

        // Fondo
        this.add.rectangle(
    400,
    300,
    800,
    600,
    backgroundColor,
    0.1
);

        // Mundo
        this.physics.world.setBounds(0, 0, 800, 600);

        // Groups
        this.bullets = this.physics.add.group();
        this.zombies = this.physics.add.group();

        // Player
        const x = GameState.nextSpawnX ?? 400;
        const y = GameState.nextSpawnY ?? 300;

        this.player = new PlayerSystem(this, x, y);
        GameState.nextSpawnX = null;
        GameState.nextSpawnY = null;

// Bullet vs Zombie
this.physics.add.overlap(
    this.bullets,
    this.zombies,
    (bullet, zombie) => {

        if (!zombie || !zombie.enemy) return;

        let damage = 1;

        // shotgun
        if (bullet && bullet.isShotgun === true) {
            damage = 3;
        }

        // boss más resistente
        if (zombie.isBoss === true) {
            damage *= 0.3;
        }

        zombie.enemy.damage(damage);

        // destruir bala al final (más seguro)
        if (bullet && bullet.destroy) {
            bullet.destroy();
        }
    }
);

        // Player vs Zombie
        this.physics.add.overlap(
            this.player.sprite,
            this.zombies,
            () => {

                this.player.damage(10);

            }
        );

        // UI
        this.ui = this.add.text(
            10,
            10,
            "",
            {
                fontSize: "16px",
                fill: "#ffffff"
            }
        );
    }

spawnZombie() {

    const x = Phaser.Math.Between(40, 760);
    const y = Phaser.Math.Between(40, 560);

    const r = Math.random();

    if (r < 0.6) {
        new Zombie(this, x, y);
    }
    else if (r < 0.9) {
        new FastZombie(this, x, y);
    }
    else {
        new TankZombie(this, x, y);
    }
}

spawnBoss() {

    const x = Phaser.Math.Between(100, 700);
    const y = Phaser.Math.Between(100, 500);

    new BossZombie(this, x, y);
}

    updateZombies() {

    this.zombies.getChildren().forEach(z => {

        if (z.enemy) {
            z.enemy.update(this.player.sprite);
        }

    });
}

    updateUI(title) {

    let ammoText = "";
    let weaponText = "";

    if (GameState.weapon === "pistol") {

        weaponText = "Pistola";

        ammoText =
            "Balas: " +
            GameState.magazine +
            "/" +
            GameState.maxMagazine;
    }
    else {

        weaponText = "Shotgun";

        ammoText =
            "Shells: " +
            GameState.shotgunAmmo +
            "/" +
            GameState.shotgunMaxAmmo;
    }

    this.ui.setText(
        title + "\n" +
        "HP: " +
        GameState.hp +
        "/" +
        GameState.maxHp + "\n" +
        ammoText + "\n" +
        "Arma: " + weaponText + "\n" +
        "Llave: " +
        (GameState.hasFinalKey ? "SI" : "NO")
    );
}

}