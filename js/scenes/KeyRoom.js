import BaseScene from "./BaseScene.js";
import { GameState } from "../state/GameState.js";

export default class KeyRoom extends BaseScene {

    constructor(){
        super("KeyRoom");
    }

    create(){

        this.createCommon(0x555522);

        this.time.addEvent({
            delay: 1200,
            loop: true,
            callback: ()=> this.spawnZombie(75)
        });

        this.makeExit();
    }

    makeExit(){

        const door = this.add.rectangle(40,300,40,80,0xffffff);
        this.physics.add.existing(door,true);

        this.physics.add.overlap(
            this.player.sprite,
            door,
            ()=>{
                GameState.nextSpawnX = 720;
                GameState.nextSpawnY = 300;
                this.scene.start("Hub");
            }
        );
    }

    update(){
        this.player.update();
        this.updateZombies();
        this.updateUI("KEY ROOM");
    }
}