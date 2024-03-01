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
    if ( mRenderable != null ) {
      // use reference to renderable as key
      // no animations right now so have an empty list
      this.renderableMap.set(mRenderable, []);

      // return the empty list
      return this.renderableMap.get(mRenderable);
    }

    // renderable not added
    return null
  }

  // get animations associated with renderable
  getAnimations(mRenderable) {
    if(mRenderable != null){
      return this.renderableMap.get(mRenderable);
    }

    return null
  }

  // create a new animation and add it to the renderable map
  newAnimation(mRenderable) {
    // check renderable is not null
    // other safety check here? Ensure renderable is renderable
    if( mRenderable != null ){
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

    return null;
  }
}

class Animation {
  constructor(mRenderable) {
    this.mRenderable = mRenderable;
    this.mFrames = [];
  }

  addFrame(mRenderable) {
    if ( mRenderable != null ) {
      let toAdd = new Frame(mRenderable);

      this.mFrames.push(toAdd);
    }
  }

  getFrames() {
    return this.mFrames;
  }
}

class Frame {
  constructor(mRenderable){
    // create new transform
    this.mTransform = new Transform();

    // copy values of the renderables transformation
    this.mTransform.setXPos(mRenderable.getXform().getXPos());

    this.mTransform.setYPos(mRenderable.getXform().getYPos());
  }

  getXPos() {
    return this.mTransform.getXPos();
  }

  getYPos() {
    return this.mTransform.getYPos();
  }
}

export default KeyFramer;
