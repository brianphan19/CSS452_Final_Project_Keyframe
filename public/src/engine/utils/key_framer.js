/*
 * File: key_framer.js
 *       Encapsulates key frame animation functionality
 */
"use strict";

import Transform from "./transform.js";


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
    this.mFrames = [];
  }

  addFrame(mRenderable, index) {
    if ( mRenderable != null ) {
      let toAdd = new Frame(mRenderable);      
      this.mFrames.push([index * 60, toAdd]);
    }
  }

  getFrames() {
    return this.mFrames;
  }
}

class Frame {
  constructor(mRenderable){
    // create new transform
    this.width = mRenderable.getXform().getWidth();
    this.height = mRenderable.getXform().getWidth();
    this.XPos = mRenderable.getXform().getXPos();
    this.YPos = mRenderable.getXform().getYPos();
    this.rotationInDegree = mRenderable.getXform().getRotationInDegree();
    this.color = mRenderable.getColor();
  }


  getXPos() { return this.XPos; }
  getYPos() { return this.YPos; }
  getWidth() { return this.width; }
  getHeight() { return this.height; }
  getRotationInDegree() { return this.rotationInDegree; }
  getColor() { return this.color; }
}

export default KeyFramer;
