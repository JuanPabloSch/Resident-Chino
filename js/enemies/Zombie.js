import Enemy from "./Enemy.js";

export default class Zombie extends Enemy {

    constructor(scene, x, y) {
        super(scene, x, y, "zombie", 60, 1);
    }
}