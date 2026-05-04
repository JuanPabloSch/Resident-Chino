import Enemy from "./Enemy.js";

export default class BossZombie extends Enemy {

    constructor(scene, x, y) {

        // color rojo, lento, MUCHA vida
        super(scene, x, y, 0xff0000, 30, 30);

        this.sprite.isBoss = true;
    }
}