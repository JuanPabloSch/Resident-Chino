import Enemy from "./Enemy.js";

export default class FastZombie extends Enemy {

    constructor(scene, x, y) {
        super(scene, x, y, 'zombie_fast', 140, 1);

        this.facing = 'front';
        this.sprite.setOrigin(0.5);
    }

    update(player) {
        super.update(player);

        const dx = player.x - this.sprite.x;
        const dy = player.y - this.sprite.y;

        if (Math.abs(dx) > Math.abs(dy)) {
            this.facing = dx > 0 ? 'right' : 'left';
        } else {
            this.facing = dy > 0 ? 'front' : 'back';
        }

        this.updateFrame();
    }

    updateFrame() {
        switch (this.facing) {
            case 'front':
                this.sprite.setFrame(0);
                break;
            case 'back':
                this.sprite.setFrame(1);
                break;
            case 'left':
                this.sprite.setFrame(2);
                break;
            case 'right':
                this.sprite.setFrame(3);
                break;
        }
    }
}