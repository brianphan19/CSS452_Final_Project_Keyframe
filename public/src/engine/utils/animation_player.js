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
    this.updateColor(dt);
        
    if (this.currentTick >= this.nextFrame[0]) this.currentFrameIndex++;
  }

  updateDisplacement(dt){
    const currentFrameX = this.currentFrame[1].getXPos();
    const currentFrameY = this.currentFrame[1].getYPos();

    const nextFrameX = this.nextFrame[1].getXPos();
    const nextFrameY = this.nextFrame[1].getYPos();

    const dx = nextFrameX  - currentFrameX;
    const dy = nextFrameY - currentFrameY;
    
    if (dx == 0 && dy == 0) return;

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

    const dw = nextFrameWidth - currentFrameWidth;
    const dh = nextFrameHeight - currentFrameHeight;

    if (dw == 0 && dh == 0) {
      return; // No change in size
    }

    const newWidth = currentFrameWidth + dw * dt;
    const newHeight = currentFrameHeight + dh * dt;

    this.renderable.getXform().setWidth(newWidth);
    this.renderable.getXform().setHeight(newHeight);
  }
  updateRotation(dt) {
      const currentRotation = this.currentFrame[1].getRotationInDegree();
      const nextRotation = this.nextFrame[1].getRotationInDegree();

      const dr = nextRotation - currentRotation;

      if (dr == 0) {
          return; // No change in rotation
      }

      const newRotation = currentRotation + dr * dt;

      this.renderable.getXform().setRotationInDegree(newRotation);
  }
  updateColor(dt) {
    const currentR = this.currentFrame[1].getColor()[0];
    const currentG = this.currentFrame[1].getColor()[1];
    const currentB = this.currentFrame[1].getColor()[2];

    const nextR = this.nextFrame[1].getColor()[0];
    const nextG = this.nextFrame[1].getColor()[1];
    const nextB = this.nextFrame[1].getColor()[2];
    
    const dR = nextR - currentR;
    const dG = nextG - currentG;
    const dB = nextB - currentB;

    if (dR == 0 && dG == 0 && dB == 0) {
      return; // No change
    }

    const newR = currentR + dR * dt;
    const newG = currentG + dG * dt;
    const newB = currentB + dB * dt;

    this.renderable.setColor([newR, newG, newB, 1.0]);
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
