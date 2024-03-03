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

        this.frameIndex = this.player.currentFrameIndex;
        this.objectSize = this.mBox.getXform().getSize();
        this.objectDegree = this.mBox.getXform().getRotationInDegree();
        this.objectPos = this.mBox.getXform().getPosition();

        this.mMsg1 = new engine.FontRenderable("Playing(" + false + ")  Next Frame Index(" + this.frameIndex + ")");
        this.mMsg1.setColor([1, 1, 1, 1]);
        this.mMsg1.getXform().setPosition(-18,-5);
        this.mMsg1.setTextHeight(3);

        this.mMsg2 = new engine.FontRenderable("Data: Position(" + this.objectPos + 
                                                      ")  Size(" + this.objectSize + 
                                                    ")  Degree(" + this.objectDegree + ")")
        this.mMsg2.setColor([1, 1, 1, 1]);
        this.mMsg2.getXform().setPosition(-18,-8);
        this.mMsg2.setTextHeight(3);
    }
    
    // This is the draw function, make sure to setup proper drawing environment, and more
    // importantly, make sure to _NOT_ change any state.
    draw() {
        // Step A: clear the canvas
        engine.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray
        this.mCamera.setViewAndCameraMatrix();
        this.mMsg1.draw(this.mCamera);
        this.mMsg2.draw(this.mCamera);

        this.mBox.draw(this.mCamera);
    }
    
    // The Update function, updates the application state. Make sure to _NOT_ draw
    // anything from this function!
    update () {
        this.player.update();
        //add frame
        this.addNewFrame()

        // movement
        this.objectChange();

        if (engine.input.isKeyClicked(engine.input.keys.P)) {
            this.player.pause();
        }
        if (engine.input.isKeyClicked(engine.input.keys.R)) {
            this.player.resume();
        }

        //change frame index
        this.changeFrameIndex(1);

        //go to frame number
        this.statusMessage();
    }
    
    objectChange() {
        this.objectMovement(); 
        this.changeObjectSize(.1);
        this.rotateTarget(1);
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

    changeObjectSize(deltaSize) {
        if (engine.input.isKeyPressed(engine.input.keys.K)) {
            this.mBox.getXform().incSizeBy(deltaSize);
            this.objectSize += deltaSize;
        }
        if (engine.input.isKeyPressed(engine.input.keys.J)) {
            this.mBox.getXform().incSizeBy(-deltaSize);
            this.objectSize -= deltaSize;
        }
    }

    rotateTarget(deltaDegree) {
        if (engine.input.isKeyPressed(engine.input.keys.O)) {
            this.mBox.getXform().incRotationByDegree(deltaDegree);
            this.objectDegree += deltaDegree;
            if (this.objectDegree == 360) this.objectDegree = 0;
        }
        if (engine.input.isKeyPressed(engine.input.keys.I)) {
            this.mBox.getXform().incRotationByDegree(-deltaDegree);
            this.objectDegree -= deltaDegree;
            if (this.objectDegree == -360) this.objectDegree = 0;
        }
    }

    addNewFrame() {
        if (engine.input.isKeyClicked(engine.input.keys.Space)) {
            this.animation.addFrame(this.mBox, this.frameIndex++);
        }
    }
    statusMessage() {
        if (this.player.isPlaying) {
            this.mMsg1.setText("Playing(" + true + ")  Current Frame Index(" + (this.player.currentTick / 60 ).toFixed(2) + ")");
            this.mMsg2.setText("Data: Position(" + this.player.renderable.getXform().getPosition()[0].toFixed(0) + "," + this.player.renderable.getXform().getPosition()[1].toFixed(0) +
                                      ")  Size(" + this.player.renderable.getXform().getSize()[0].toFixed(0) + "," + this.player.renderable.getXform().getSize()[1].toFixed(0) +
                                      ")  Degree(" + this.player.renderable.getXform().getRotationInDegree().toFixed(0) + ")")
            return;
        }
        this.mMsg1.setText("Playing(" + false + ")  Next Frame Index(" + this.frameIndex + ")");
        this.mMsg2.setText("Data: Position(" + this.objectPos + 
                                  ")  Size(" + this.objectSize + 
                                ")  Degree(" + this.objectDegree + ")")
    }
}

window.onload = function () {
    engine.init("GLCanvas");

    let myGame = new MyGame();
    myGame.start();
}
