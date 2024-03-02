"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../engine/index.js";
import Renderable from "../engine/renderables/renderable.js";
import KeyFramer from "../engine/utils/key_framer.js";
import AnimationPlayer from "../engine/utils/animation_player.js";
import { playBackground } from "../engine/resources/audio.js";

class MyGame extends engine.Scene {
    constructor() {
        super();

        // The camera to view the scene
        this.mCamera = null;

        // a simple box to test with
        this.mBox;

        // declaration of keyframer reference
        this.mKeyFramer;
        this.mMsg = null;
    }
        
    init() {
        // Step A: set up the cameras
        this.mCamera = new engine.Camera(
            vec2.fromValues(30, 27.5), // position of the camera
            100,                       // width of camera
            [0, 0, 640, 480]           // viewport (orgX, orgY, width, height)
        );

        // sets the background to gray
        this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);

        // initialization of simple box
        this.mBox = new Renderable();
        this.mBox.setColor([1,0,1,1]);
        this.mBox.getXform().setSize(5,5);
        this.mBox.getXform().setPosition(0, 0);

        this.frameIndex = 0;
        this.interpolationSpd = 0.05;
        this.interpolationCycles = 120;
        this.mMsg = new engine.FontRenderable("Status: Frame Index(" + this.frameIndex + ")   Rate(" + this.interpolationSpd.toFixed(2) + ")   Cycle(" + this.interpolationCycles + ")");
        this.mMsg.setColor([1, 1, 1, 1]);
        this.mMsg.getXform().setPosition(-18,-8);
        this.mMsg.setTextHeight(3);

        this.moveSpeed = 1;

        // initialization of keyframer object
        this.mKeyFramer = new KeyFramer();

        // add renderable to KeyFramer map
        this.mKeyFramer.setRenderable(this.mBox);

        // create new animation
        this.animation = this.mKeyFramer.newAnimation(this.mBox);
        

        // create new frame
        // this.animation.addFrame(this.mBox);

        // add frame with new box coordinates
        // this.animation.addFrame(this.mBox);

        // animation player
        this.player = new AnimationPlayer()

        // start animation
        this.player.playAnimation(this.animation);
        
    }
    
    // This is the draw function, make sure to setup proper drawing environment, and more
    // importantly, make sure to _NOT_ change any state.
    draw() {
        // Step A: clear the canvas
        engine.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray
        this.mCamera.setViewAndCameraMatrix();
        this.mMsg.draw(this.mCamera);

        this.mBox.draw(this.mCamera);
    }
    
    // The Update function, updates the application state. Make sure to _NOT_ draw
    // anything from this function!
    update () {
        this.player.update(this.animation);
        //add frame
        this.addNewFrame()

        // movement
        this.objectMovement(); 

        if (engine.input.isKeyClicked(engine.input.keys.P)) {
            this.player.pause();
        }
        if (engine.input.isKeyClicked(engine.input.keys.R)) {
            this.player.resume();
        }

        //frame rate of change
        this.changeInterpolateSpeed(0.01);

        //frame interpolation cycle
        this.changeInterpolateCycles(1);

        //go to frame number
        this.goToFrameNumber();
        this.statusMessage();
    }
w
    objectMovement() {
        this.objectMovementArrow();
        this.objectMovementKeyBoard();
    }

    objectMovementArrow() {
        if (engine.input.isKeyPressed(engine.input.keys.Up)) {
            this.mBox.getXform().incYPosBy(this.moveSpeed);
        }
        if (engine.input.isKeyPressed(engine.input.keys.Down)) {
            this.mBox.getXform().incYPosBy(-this.moveSpeed);
        }
        if (engine.input.isKeyPressed(engine.input.keys.Right)) {
            this.mBox.getXform().incXPosBy(this.moveSpeed);
        }
        if (engine.input.isKeyPressed(engine.input.keys.Left)) {
            this.mBox.getXform().incXPosBy(-this.moveSpeed);
        }
    }

    objectMovementKeyBoard() {
        if (engine.input.isKeyPressed(engine.input.keys.W)) {
            this.mBox.getXform().incYPosBy(this.moveSpeed);
        }
        if (engine.input.isKeyPressed(engine.input.keys.S)) {
            this.mBox.getXform().incYPosBy(-this.moveSpeed);
        }
        if (engine.input.isKeyPressed(engine.input.keys.D)) {
            this.mBox.getXform().incXPosBy(this.moveSpeed);
        }
        if (engine.input.isKeyPressed(engine.input.keys.A)) {
            this.mBox.getXform().incXPosBy(-this.moveSpeed);
        }
    }

    changeInterpolateSpeed(deltaSpeed) {
        if (engine.input.isKeyPressed(engine.input.keys.I)) {
            console.log(this.player.rate);
            this.player.changeRate(deltaSpeed);
            this.interpolationSpd += deltaSpeed;
        }
        if (engine.input.isKeyPressed(engine.input.keys.U)) {
            console.log(this.player.rate);
            this.player.changeRate(-deltaSpeed);
            this.interpolationSpd -= deltaSpeed;
        }
    }
    
    changeInterpolateCycles(deltaCycles) {
        if (engine.input.isKeyPressed(engine.input.keys.K)) {
            console.log(this.player.cycles);
            this.player.changeCycles(deltaCycles);
            this.interpolationCycles += deltaCycles;
        }
        if (engine.input.isKeyPressed(engine.input.keys.J)) {
            console.log(this.player.cycles);
            this.player.changeCycles(-deltaCycles);
            this.interpolationCycles -= deltaCycles;
        }
    }
    addNewFrame() {
        if (engine.input.isKeyClicked(engine.input.keys.Space)) {
            this.animation.addFrame(this.mBox, this.frameIndex++);
        }
    }
    statusMessage() {
        this.mMsg.setText("Status: Frame Index(" + this.frameIndex + ")   Rate(" + this.interpolationSpd.toFixed(2) + ")   Cycle(" + this.interpolationCycles + ")");
    }

    goToFrameNumber() {
        if (engine.input.isKeyClicked(engine.input.keys.Zero)) {
            this.player.skipToFrame(0);
        }

        if (engine.input.isKeyClicked(engine.input.keys.One)) {
            this.player.skipToFrame(1);
        }

        if (engine.input.isKeyClicked(engine.input.keys.Two)) {
            this.player.skipToFrame(2);
        }

        if (engine.input.isKeyClicked(engine.input.keys.Three)) {
            this.player.skipToFrame(3);
        }

        if (engine.input.isKeyClicked(engine.input.keys.Four)) {
            this.player.skipToFrame(4);
        }
    }

}

window.onload = function () {
    engine.init("GLCanvas");

    let myGame = new MyGame();
    myGame.start();
}
