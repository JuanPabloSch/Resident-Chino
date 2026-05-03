import PlayerSystem from "../systems/PlayerSystem.js";
import { GameState } from "../state/GameState.js";

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
            backgroundColor
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

                if (zombie.isBoss) return;

                bullet.destroy();
                zombie.destroy();
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

    spawnZombie(speed) {

        const x = Phaser.Math.Between(40, 760);
        const y = Phaser.Math.Between(40, 560);

        const zombie = this.add.rectangle(
            x,
            y,
            30,
            30,
            0xff0000
        );

        this.physics.add.existing(zombie);

        zombie.speed = speed;

        this.zombies.add(zombie);
    }

    updateZombies() {

        this.zombies.getChildren().forEach((zombie) => {

            this.physics.moveToObject(
                zombie,
                this.player.sprite,
                zombie.speed
            );

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