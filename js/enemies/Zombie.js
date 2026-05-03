import Enemy from "./Enemy.js";

export default class Zombie extends Enemy {

    constructor(scene, x, y) {
        super(scene, x, y, 0xff0000, 60, 1);
    }
}