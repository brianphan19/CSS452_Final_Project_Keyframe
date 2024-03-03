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

    let dt = (this.currentTick - this.frames[this.currentFrameIndex][0]) /  
              (this.frames[this.currentFrameIndex+1][0] - this.frames[this.currentFrameIndex][0]);

    this.updateDisplacement(dt);
    this.updateSize(dt);
    this.updateRotation(dt);
        
    if (this.currentTick >= this.frames[this.currentFrameIndex+1][0]) this.currentFrameIndex++;
  }

  updateDisplacement(dt){

    let dx = this.frames[this.currentFrameIndex+1][1].getXPos() - this.frames[this.currentFrameIndex][1].getXPos();
    let dy = this.frames[this.currentFrameIndex+1][1].getYPos() - this.frames[this.currentFrameIndex][1].getYPos();
    //(pos2 - pos1) / (t2 - t1)
    this.renderable.getXform().setXPos(this.frames[this.currentFrameIndex][1].getXPos() + dx*dt);
    this.renderable.getXform().setYPos(this.frames[this.currentFrameIndex][1].getYPos() + dy*dt);
  }

  updateSize(dt) {
    let dw = this.frames[this.currentFrameIndex+1][1].getWidth() - this.frames[this.currentFrameIndex][1].getWidth();
    let dh = this.frames[this.currentFrameIndex+1][1].getHeight() - this.frames[this.currentFrameIndex][1].getHeight();
    
    this.renderable.getXform().setWidth(this.frames[this.currentFrameIndex][1].getWidth() + dw*dt);
    this.renderable.getXform().setHeight(this.frames[this.currentFrameIndex][1].getHeight() + dh*dt);
  }

  updateRotation(dt) {
    let dr = this.frames[this.currentFrameIndex+1][1].getRotationInDegree() - this.frames[this.currentFrameIndex][1].getRotationInDegree();
                
    this.renderable.getXform().setRotationInDegree(this.frames[this.currentFrameIndex][1].getRotationInDegree() + dr*dt);
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
