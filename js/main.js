import Hub from "./scenes/Hub.js";
import LockdownRoom from "./scenes/LockdownRoom.js";
import ButtonRoom from "./scenes/ButtonRoom.js";
import KeyRoom from "./scenes/KeyRoom.js";

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,

    physics: {
        default: "arcade",
        arcade: { debug: false }
    },

    scene: [
        Hub,
        LockdownRoom,
        ButtonRoom,
        KeyRoom
    ]
};

new Phaser.Game(config);