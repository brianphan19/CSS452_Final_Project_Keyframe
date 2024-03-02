/*
 * File: animation_player.js
 *       Encapsulates play back of animation class
 */
"use strict";

import Lerp from "./lerp.js";

class AnimationPlayer {
  constructor() {
    // characteristics of the animation
    // number of cycles for interpolator
    this.cycles = 120;
    // speed of interpolator
    this.rate = .05;
    // should the animation be playing
    this.isPlaying = false;

    // initialized by play animation
    // tells use which frame is being interpolated
    this.frameIndex = null;
    // list of all frames in the animation
    this.frames = [];
    // current position of renderable
    this.currXPos;
    this.currYPos;
    // interpolated values for x and y
    this.interpolateX;
    this.interpolateY;
  }

  // grab data from animation class
  // start interpolation
  playAnimation(animation) {
    // swap is playing to true
    this.isPlaying = true;

    // get frame list
    this.frames = animation.getFrames();

    // reference the renderable attached to the animation class
    // set the current x and y position
    this.currXPos = animation.mRenderable.getXform().getXPos();
    this.currYPos = animation.mRenderable.getXform().getYPos();

    // start interpolation with current position of renderable
    this.interpolateX = new Lerp(this.currXPos, this.cycles, this.rate);
    this.interpolateY = new Lerp(this.currYPos, this.cycles, this.rate);

    // move to the first frame
    this.moveToNextFrame();
  }

  update(animation){
    // if the animation is meant to be played
    if( this.isPlaying ){
      // if there are remaining cycles
      if( this.interpolateX.mCyclesLeft != 0 ) {
        // get updated interpolated values
        this.interpolateX.update();
        this.interpolateY.update();

        // update renderables x and y position
        animation.mRenderable.getXform().setXPos(this.interpolateX.get());
        animation.mRenderable.getXform().setYPos(this.interpolateY.get());

        return true;
      }

      // no remaining cycles move to the next frame
      // if true is returned we can move to another frame
      return this.moveToNextFrame(animation);
    }

    return false;
  }

  // increments frame index
  moveToNextFrame(animation){
     // if there are no frames to be played return false
    if( this.frames.length == 0 ) return false;
    
    // if index is null then we are on the first frame
    if( this.frameIndex == null ){
      // set frame index
      this.frameIndex = 0;
    }

    // if the index is out of bounds there are no more frames
    if(this.frameIndex >= this.frames.length) this.frameIndex = 0;

    // grab frame
    let frame = this.frames[this.frameIndex];

    this.interpolateX.setFinal(frame.getXPos());
    this.interpolateY.setFinal(frame.getYPos());
    // increment frame index
    this.frameIndex++;
    return true;
  }

  pause(){
    this.isPlaying = false;
    return this.isPlaying;
  }

  resume(){
    if( this.frameIndex != null ) this.isPlaying = true;
    return this.isPlaying;
  }

  skipToFrame(frameIndex){
    if (this.frames.length > frameIndex) {
      this.frameIndex = frameIndex;
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
