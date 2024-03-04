/*
 * File: key_framer.js
 *       Encapsulates key frame animation functionality
 */
"use strict";


// value: target for interpolation
// cycles: integer, how many cycle it should take for a value to change to final
// rate: the rate at which the value should change at each cycle
class KeyFramer {
  constructor() {
    // as we creation animations for a renderable we had them to the map
    // key: renderable reference
    // value: list of associated animations
    this.renderableMap = new Map()

  }

  //add a renderable to the renderable map
  setRenderable(mRenderable) {
    // check if renderable is null
    if (mRenderable == null) return null;

    // use reference to renderable as key
    // no animations right now so have an empty list
    this.renderableMap.set(mRenderable, []);

    // return the empty list
    return this.renderableMap.get(mRenderable);
  }

  // get animations associated with renderable
  getAnimations(mRenderable) {
    if (mRenderable == null) return null;
    return this.renderableMap.get(mRenderable);
  }

  // create a new animation and add it to the renderable map
  newAnimation(mRenderable) {
    // check renderable is null
    if( mRenderable == null ) return null;
    // other safety check here? Ensure renderable is renderable
    
    // grab current animations list associated with renderable
    let currAnimations = this.renderableMap.get(mRenderable)

    // create new animation to add to list
    let toAdd = new Animation(mRenderable);

    // append to end of list
    currAnimations.push(toAdd);

    //update map value
    this.renderableMap.set(mRenderable, toAdd);

    return toAdd;
  }
}

class Animation {
  constructor(mRenderable) {
    this.mRenderable = mRenderable;
    this.firstFrame = null;
    this.lastFrame = null;
  }

  addFrame(mRenderable, index = null) {
    if ( mRenderable === null ) return false;
    let newFrame = new Frame(mRenderable, index * 60);
    
    //if list is empty
    if (this.isEmpty()) {
      newFrame.frameIndex = 0;
      this.firstFrame = newFrame;
      this.lastFrame = newFrame;
      return false;
    } 

    //if user add frame without index, the default will be add frame with index right after the last frame
    if (index === null) {
      newFrame.frameIndex = this.lastFrame.frameIndex + 60;
      this.lastFrame.next = newFrame;
      this.lastFrame = newFrame;
      return false;
    } 

    //if user want to add frame at specific index
    let prevFrame = this.getFrameBeforeIndex(index * 60);
    //safeguard for adding frame with used index on the same animation
    if(prevFrame.next !== null && index * 60 === prevFrame.next.frameIndex) return false;

    newFrame.next = prevFrame.next;
    prevFrame.next = newFrame;   
    this.lastFrame = newFrame;
    return true;
  }

  getFirstFrame() { return this.firstFrame; }
  isEmpty() { return this.firstFrame === null; }

  deleteFrame(index = null) {
    if (this.isEmpty()) return false;
    if (index === null) index = this.lastFrame.frameIndex;

    let prevFrame = this.getFrameBeforeIndex(index);

    prevFrame.next = prevFrame.next.next;
    return true;
  }

  getFrameBeforeIndex(index) {
    let currFrame = this.firstFrame;
    let prevFrame = currFrame;

    while (currFrame !== null) {
      if (currFrame.frameIndex >= index) break;
      
      prevFrame = currFrame;
      currFrame = currFrame.next;
    }

    return prevFrame;
  }
 }

class Frame {
  constructor(mRenderable, index){
    // object state
    this._width = mRenderable.getXform().getWidth();
    this._height = mRenderable.getXform().getWidth();
    this._XPos = mRenderable.getXform().getXPos();
    this._YPos = mRenderable.getXform().getYPos();
    this._rotationInDegree = mRenderable.getXform().getRotationInDegree();
    this._color = mRenderable.getColor();

    this.frameIndex = index;
    this.next = null;
  }

  getXPos() { return this._XPos; }
  getYPos() { return this._YPos; }
  getWidth() { return this._width; }
  getHeight() { return this._height; }
  getRotationInDegree() { return this._rotationInDegree; }
  getColor() { return this._color; }
}

export default KeyFramer;
