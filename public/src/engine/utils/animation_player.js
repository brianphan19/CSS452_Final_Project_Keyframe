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
    this.currentFrame;
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
    this.currentFrame = 0;
    this.currentTick = 0;

    // get frame list
    this.frames = animation.getFrames();
  }

  update(animation){
    // if the animation is meant to be played
    if (!this.isPlaying ) return;

    // if the player does not have any frames
    if (this.frames.length == 0 ) return ;
    if (this.frames[this.currentFrame + 1] == null) return this.pause();
    this.currentTick++;

    
    let dt = (this.currentTick - this.frames[this.currentFrame][0]) / this.frames[this.currentFrame+1][0]
    let dx = this.frames[this.currentFrame+1][1].getXPos() - this.frames[this.currentFrame][1].getXPos();
    let dy = this.frames[this.currentFrame+1][1].getYPos() - this.frames[this.currentFrame][1].getYPos();
    //(pos2 - pos1) / (t2 - t1)
    this.renderable.getXform().setXPos(dx*dt);
    this.renderable.getXform().setYPos(dy*dt);

    
    if (this.currentTick >= this.frames[this.currentFrame+1][0]) this.currentFrame++;

  }

  pause(){
    this.isPlaying = false;
  }

  resume(){
    this.currentFrame = 0;
    this.isPlaying = true;
  }

  skipToFrame(frameIndex){
    if (this.frames.length > frameIndex) {
      this.currentFrame = frameIndex;
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
