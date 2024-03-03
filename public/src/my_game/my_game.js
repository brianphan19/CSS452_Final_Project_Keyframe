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
        this.player = new AnimationPlayer(this.mBox)

        // start animation
        this.player.playAnimation(this.animation);

        this.frameIndex = this.player.currentFrame;
        this.mMsg = new engine.FontRenderable("Status: Frame Index(" + this.frameIndex + ")");
        this.mMsg.setColor([1, 1, 1, 1]);
        this.mMsg.getXform().setPosition(-18,-8);
        this.mMsg.setTextHeight(3);
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

        //change frame index
        this.changeFrameIndex(1);

        //go to frame number
        this.goToFrameNumber();
        this.statusMessage();
    }

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

    changeFrameIndex(deltaFrame) {
        if (engine.input.isKeyClicked(engine.input.keys.M)) {
            this.frameIndex += deltaFrame;
        }
        if (engine.input.isKeyClicked(engine.input.keys.N)) {
            //check if frame index is 0
            if(this.frameIndex == 0) return;
            this.frameIndex -= deltaFrame;
        }
    }

    addNewFrame() {
        if (engine.input.isKeyClicked(engine.input.keys.Space)) {
            this.animation.addFrame(this.mBox, this.frameIndex++);
        }
    }
    statusMessage() {
        if (this.player.isPlaying) {
            this.mMsg.setText("Status: Playing Frame Index(" + this.player.currentFrame + ")");
            return;
        }
        this.mMsg.setText("Status: Frame Index(" + this.frameIndex + ")");
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
