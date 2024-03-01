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
    // if frame index is not null then the animation has started
    if( this.frameIndex != null ){
      // if there are remaining cycles
      if( this.interpolateX.mCyclesLeft != 0 ) {
        // get updated interpolated values
        this.interpolateX.update();
        this.interpolateY.update();
        console.log(this.interpolateX.get());

        // update renderables x and y position
        animation.mRenderable.getXform().setXPos(this.interpolateX.get());
        animation.mRenderable.getXform().setYPos(this.interpolateY.get());

        return true;
      }

      // no remaining cycles move to the next frame
      // if true is returned we can move to another frame
      return this.moveToNextFrame(animation);
    }
  }

  // increments frame index
  moveToNextFrame(animation){
    // if index is null then we are on the first frame
    if( this.frameIndex == null ){
      // set frame index
      this.frameIndex = 0;
    }

    // if there are no frames to be played return false
    if( this.frames.length == 0 ) return false;

    // if the index is out of bounds there are no more frames
    if(this.frameIndex >= this.frames.length) this.frameIndex = 0;

    // grab frame
    let frame = this.frames[this.frameIndex];

    this.interpolateX.setFinal(frame.getXPos());
    this.interpolateY.setFinal(frame.getYPos());
    // increment frame index
    this.frameIndex++;
  }
}

export default AnimationPlayer;
