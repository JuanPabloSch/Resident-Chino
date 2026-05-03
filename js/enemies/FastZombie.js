import Enemy from "./Enemy.js";

export default class FastZombie extends Enemy {

    constructor(scene, x, y) {
        super(scene, x, y, 0xff6600, 110, 1);
    }
}