/*
 * File: animation_player.js
 *       Encapsulates play back of animation class
 */
"use strict";

class AnimationPlayer {
  /**
   * Create an AnimationPlayer.
   * @param {object} mRenderable - The renderable object associated with this AnimationPlayer.
   */
  constructor(mRenderable) {
    // should the animation be playing
    this.isPlaying = false;

    //global variables used during liner interpolation
    this.currentTick;
    this.currentFrame;
    this.nextFrame;

    // list of all frames in the animation
    this.animation = null;

    this.renderable = mRenderable;
  }

  /**
   * Update function to progress the animation playback.
   *  @param {Function} interpolation_func - The interpolation function given by the user
   *  @param {Array} [other_params=null] - Arrays of parameter use for given interpolation function 
   */
  update(other_params = null, interpolation_func = null) {
    //check if user want to use default linear interpolation or their own 
    if (interpolation_func !== null) return interpolation_func(this.animation, other_params);
    
    // if the animation is meant to be played
    if (!this.isPlaying ) return;
    // if the player does not have any frames
    if (this.animation.isEmpty()) return;
    //if the player reach last frame
    if (this.currentFrame.next === null) return this.pause();

    this.currentTick++;
    let dt = (this.currentTick - this.currentFrame.frameIndex) / (this.nextFrame.frameIndex - this.currentFrame.frameIndex) ;

    //update during transition
    this.updatePlacementLinear(dt);
    this.updateSizeLinear(dt);
    this.updateRotationLinear(dt);
    this.updateColorLinear(dt);

    if (this.currentTick >= this.nextFrame.frameIndex){
      this.currentFrame = this.nextFrame;
      this.nextFrame = this.currentFrame.next;
    }
  }

  /**
   * Update the displacement of the renderable object based on linear interpolation.
   * @param {number} dt - The interpolation factor.
   */
  updatePlacementLinear(dt){
    const currentFrameX = this.currentFrame.getXPos();
    const currentFrameY = this.currentFrame.getYPos();

    const nextFrameX = this.nextFrame.getXPos();
    const nextFrameY = this.nextFrame.getYPos();

    const dx = nextFrameX  - currentFrameX;
    const dy = nextFrameY - currentFrameY;
    
    // if (dx == 0 && dy == 0) return;

    const newXPos = currentFrameX + dx * dt;
    const newYPos = currentFrameY + dy * dt;

    this.renderable.getXform().setXPos(newXPos);
    this.renderable.getXform().setYPos(newYPos);
  }

  /**
   * Update the size of the renderable object based on linear interpolation.
   * @param {number} dt - The interpolation factor.
   */
  updateSizeLinear(dt) {
    const currentFrameWidth = this.currentFrame.getWidth();
    const currentFrameHeight = this.currentFrame.getHeight();

    const nextFrameWidth = this.nextFrame.getWidth();
    const nextFrameHeight = this.nextFrame.getHeight();

    const dw = nextFrameWidth - currentFrameWidth;
    const dh = nextFrameHeight - currentFrameHeight;

    // if (dw == 0 && dh == 0) {
    //   return; // No change in size
    // }

    const newWidth = currentFrameWidth + dw * dt;
    const newHeight = currentFrameHeight + dh * dt;

    this.renderable.getXform().setWidth(newWidth);
    this.renderable.getXform().setHeight(newHeight);
  }

  /**
   * Update the rotation of the renderable object based on linear interpolation.
   * @param {number} dt - The interpolation factor.
   */
  updateRotationLinear(dt) {
      const currentRotation = this.currentFrame.getRotationInDegree();
      const nextRotation = this.nextFrame.getRotationInDegree();

      const dr = nextRotation - currentRotation;

      // if (dr == 0) {
      //     return; // No change in rotation
      // }

      const newRotation = currentRotation + dr * dt;

      this.renderable.getXform().setRotationInDegree(newRotation);
  }

  /**
   * Update the color of the renderable object based on linear interpolation.
   * @param {number} dt - The interpolation factor.
   */
  updateColorLinear(dt) {
    const currentR = this.currentFrame.getColor()[0];
    const currentG = this.currentFrame.getColor()[1];
    const currentB = this.currentFrame.getColor()[2];

    const nextR = this.nextFrame.getColor()[0];
    const nextG = this.nextFrame.getColor()[1];
    const nextB = this.nextFrame.getColor()[2];
    
    const dR = nextR - currentR;
    const dG = nextG - currentG;
    const dB = nextB - currentB;

    // if (dR == 0 && dG == 0 && dB == 0) {
    //   return; // No change in color
    // }

    const newR = currentR + dR * dt;
    const newG = currentG + dG * dt;
    const newB = currentB + dB * dt;

    this.renderable.setColor([newR, newG, newB, 1.0]);
  }

  /**
   * Pause the animation playback.
   */
  pause(){
    this.isPlaying = false;
  }

  /**
   * Start the animation playback with the given animation.
   * @param {object} animation - The animation to be played.
   */
  start(animation){
    this.animation = animation;
    if(this.animation.isEmpty()) return;

    this.isPlaying = true;
    this.currentTick = 0;

    this.currentFrame = this.animation.getFirstFrame();
    this.nextFrame = this.currentFrame.next;
  }
}

export default AnimationPlayer;
