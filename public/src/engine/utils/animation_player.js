/*
 * File: animation_player.js
 *       Encapsulates play back of animation class
 */
"use strict";

class AnimationPlayer {
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

  update() {
    // if the animation is meant to be played
    if (!this.isPlaying ) return;
    // if the player does not have any frames
    if (this.animation.isEmpty()) return;
    //if the player reach last frame
    if (this.currentFrame.next === null) return this.pause();

    this.currentTick++;
    let dt = (this.currentTick - this.currentFrame.frameIndex) / (this.nextFrame.frameIndex - this.currentFrame.frameIndex) ;

    //update during transition
    this.updateDisplacement(dt);
    this.updateSize(dt);
    this.updateRotation(dt);
    this.updateColor(dt);

    if (this.currentTick >= this.nextFrame.frameIndex){
      this.currentFrame = this.nextFrame;
      this.nextFrame = this.currentFrame.next;
    }
  }

  updateDisplacement(dt){
    const currentFrameX = this.currentFrame.getXPos();
    const currentFrameY = this.currentFrame.getYPos();

    const nextFrameX = this.nextFrame.getXPos();
    const nextFrameY = this.nextFrame.getYPos();

    const dx = nextFrameX  - currentFrameX;
    const dy = nextFrameY - currentFrameY;
    
    if (dx == 0 && dy == 0) return;

    const newXPos = currentFrameX + dx * dt;
    const newYPos = currentFrameY + dy * dt;

    this.renderable.getXform().setXPos(newXPos);
    this.renderable.getXform().setYPos(newYPos);
  }

  updateSize(dt) {
    const currentFrameWidth = this.currentFrame.getWidth();
    const currentFrameHeight = this.currentFrame.getHeight();

    const nextFrameWidth = this.nextFrame.getWidth();
    const nextFrameHeight = this.nextFrame.getHeight();

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
      const currentRotation = this.currentFrame.getRotationInDegree();
      const nextRotation = this.nextFrame.getRotationInDegree();

      const dr = nextRotation - currentRotation;

      if (dr == 0) {
          return; // No change in rotation
      }

      const newRotation = currentRotation + dr * dt;

      this.renderable.getXform().setRotationInDegree(newRotation);
  }
  updateColor(dt) {
    const currentR = this.currentFrame.getColor()[0];
    const currentG = this.currentFrame.getColor()[1];
    const currentB = this.currentFrame.getColor()[2];

    const nextR = this.nextFrame.getColor()[0];
    const nextG = this.nextFrame.getColor()[1];
    const nextB = this.nextFrame.getColor()[2];
    
    const dR = nextR - currentR;
    const dG = nextG - currentG;
    const dB = nextB - currentB;

    if (dR == 0 && dG == 0 && dB == 0) {
      return; // No change in color
    }

    const newR = currentR + dR * dt;
    const newG = currentG + dG * dt;
    const newB = currentB + dB * dt;

    this.renderable.setColor([newR, newG, newB, 1.0]);
  }

  pause(){
    this.isPlaying = false;
  }

  start(animation){
    this.isPlaying = true;
    this.currentTick = 0;

    this.animation = animation;
    this.currentFrame = this.animation.getFirstFrame();
    this.nextFrame = this.currentFrame.next;
  }
}

export default AnimationPlayer;
