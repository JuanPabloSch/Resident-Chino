export default class PreloadScene extends Phaser.Scene {

    constructor() {
        super("PreloadScene");
    }

    preload() {

        console.log("PRELOAD OK");
        //Levels
        this.load.image("bg_hub", "./assets/bg_hub.png");
        this.load.image("bg_lockdown", "./assets/bg_lockdown.png");
        this.load.image("bg_button", "./assets/bg_button.png");
        this.load.image("bg_key", "./assets/bg_key.png");
        //Player
        this.load.spritesheet("player", "./assets/player.png", {
            frameWidth: 168,
            frameHeight: 272
        });
        //ZOMBIE
        this.load.spritesheet("zombie", "./assets/zombie.png", {
            frameWidth: 168,
            frameHeight: 253
        });
        }

    create() {
        this.scene.start("Hub");
    }
}