import Enemy from "./Enemy.js";

export default class TankZombie extends Enemy {

    constructor(scene, x, y) {
        super(scene, x, y, 0x880000, 40, 5);
    }
}