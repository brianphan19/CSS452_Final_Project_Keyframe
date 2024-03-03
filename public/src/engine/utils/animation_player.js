/*
 * File: animation_player.js
 *       Encapsulates play back of animation class
 */
"use strict";

import Lerp from "./lerp.js";

class AnimationPlayer {
  constructor(mRenderable) {
    // characteristics of the animation
    // number of cycles for interpolator
    this.cycles = 120;
    // speed of interpolator
    this.rate = .05;
    // should the animation be playing
    this.isPlaying = false;

    // initialized by play animation
    // tells use which frame is being interpolated
    this.currentFrameIndex;
    this.currentTick;
    this.currentFrame;
    this.nextFrame;
    // list of all frames in the animation
    this.frames = [];
    this.renderable = mRenderable;
  }

  // grab data from animation class
  // start interpolation
  playAnimation(animation) {
    // swap is playing to true
    this.isPlaying = false;
    this.currentFrameIndex = 0;
    this.currentTick = 0;

    // get frame list
    this.frames = animation.getFrames();
  }

  update() {
    // if the animation is meant to be played
    if (!this.isPlaying ) return;

    // if the player does not have any frames
    if (this.frames.length == 0 ) return ;
    if (this.frames[this.currentFrameIndex + 1] == null) return this.pause();
    this.currentTick++;

    this.currentFrame = this.frames[this.currentFrameIndex];
    this.nextFrame = this.frames[this.currentFrameIndex + 1];

    let dt = (this.currentTick - this.currentFrame[0]) / (this.nextFrame[0] - this.currentFrame[0]);

    this.updateDisplacement(dt);
    this.updateSize(dt);
    this.updateRotation(dt);
        
    if (this.currentTick >= this.nextFrame[0]) this.currentFrameIndex++;
  }

  updateDisplacement(dt){
    const currentFrameX = this.currentFrame[1].getXPos();
    const currentFrameY = this.currentFrame[1].getYPos();

    const nextFrameX = this.nextFrame[1].getXPos();
    const nextFrameY = this.nextFrame[1].getYPos();

    if (currentFrameX == nextFrameX && currentFrameY == nextFrameY) return; 

    const dx = nextFrameX  - currentFrameX;
    const dy = nextFrameY - currentFrameY;

    const newXPos = currentFrameX + dx * dt;
    const newYPos = currentFrameY + dy * dt;

    this.renderable.getXform().setXPos(newXPos);
    this.renderable.getXform().setYPos(newYPos);
  }
  updateSize(dt) {
    const currentFrameWidth = this.currentFrame[1].getWidth();
    const currentFrameHeight = this.currentFrame[1].getHeight();

    const nextFrameWidth = this.nextFrame[1].getWidth();
    const nextFrameHeight = this.nextFrame[1].getHeight();

    if (nextFrameWidth === currentFrameWidth && nextFrameHeight === currentFrameHeight) {
        return; // No change in size
    }

    const dw = nextFrameWidth - currentFrameWidth;
    const dh = nextFrameHeight - currentFrameHeight;

    const newWidth = currentFrameWidth + dw * dt;
    const newHeight = currentFrameHeight + dh * dt;

    this.renderable.getXform().setWidth(newWidth);
    this.renderable.getXform().setHeight(newHeight);
}

updateRotation(dt) {
    const currentRotation = this.currentFrame[1].getRotationInDegree();
    const nextRotation = this.nextFrame[1].getRotationInDegree();

    if (nextRotation === currentRotation) {
        return; // No change in rotation
    }

    const dr = nextRotation - currentRotation;

    const newRotation = currentRotation + dr * dt;

    this.renderable.getXform().setRotationInDegree(newRotation);
}

  pause(){
    this.isPlaying = false;
  }

  resume(){
    this.currentFrameIndex = 0;
    this.isPlaying = true;
    this.currentTick = 0;
  }

  skipToFrame(frameIndex){
    if (this.frames.length > frameIndex) {
      this.currentFrameIndex = frameIndex;
      return true;
    }
    return false;
  }

  changeRate(int){
    this.rate += int;
    this.interpolateX = new Lerp(this.currXPos, this.cycles, this.rate);
    this.interpolateY = new Lerp(this.currYPos, this.cycles, this.rate);
  }

  changeCycles(int){
    this.cycles += int;
    this.interpolateX = new Lerp(this.currXPos, this.cycles, this.rate);
    this.interpolateY = new Lerp(this.currYPos, this.cycles, this.rate);
  }
}

export default AnimationPlayer;
