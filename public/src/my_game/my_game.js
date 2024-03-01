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

        // initialization of keyframer object
        this.mKeyFramer = new KeyFramer();

        // add renderable to KeyFramer map
        this.mKeyFramer.setRenderable(this.mBox);

        // create new animation
        this.animation = this.mKeyFramer.newAnimation(this.mBox);

        // create new frame
        this.animation.addFrame(this.mBox);

        // move box
        this.mBox.getXform().setPosition(50,50);

        // add frame with new box coordinates
        this.animation.addFrame(this.mBox);

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


        this.mBox.draw(this.mCamera);
    }
    
    // The Update function, updates the application state. Make sure to _NOT_ draw
    // anything from this function!
    update () {
        this.player.update(this.animation);
    }
}

window.onload = function () {
    engine.init("GLCanvas");

    let myGame = new MyGame();
    myGame.start();
}
