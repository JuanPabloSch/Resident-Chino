export default class Enemy {

    constructor(scene, x, y, color, speed, hp = 1) {

        this.scene = scene;

        this.sprite = scene.add.rectangle(
            x,
            y,
            30,
            30,
            color
        );

        scene.physics.add.existing(this.sprite);

        this.sprite.enemy = this;
        this.sprite.isBoss = false;

        this.speed = speed;
        this.hp = hp;

        scene.zombies.add(this.sprite);
    }

    update(player) {

        this.scene.physics.moveToObject(
            this.sprite,
            player,
            this.speed
        );
    }

    damage(amount = 1) {

        this.hp -= amount;

        if (this.hp <= 0) {
            this.sprite.destroy();
        }
    }
}