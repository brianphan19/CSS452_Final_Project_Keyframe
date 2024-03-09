/**
 * File: key_framer.js
 *       Encapsulates key frame animation functionality
 */
"use strict";

import AnimationDatabase from "./animation_database.js";
import Animation from "./animation.js"

/**
 * Class representing a KeyFramer for managing key frame animations.
 */
class KeyFramer {
  /**
   * Create a KeyFramer.
   */
  constructor() {
    // Map to store renderables and their associated animations
    this.renderableMap = new Map();
  }

  /**
   * Add a renderable to the renderable map.
   * @param {object} mRenderable - The renderable object to be added.
   * @returns {array|null} - An empty list of animations associated with the renderable, or null if renderable is null.
   */
  setRenderable(mRenderable) {
    // Check if renderable is null
    if (mRenderable === null) return false;

    let database = new AnimationDatabase(mRenderable);
    // Use reference to renderable as key and store an empty list of animations
    this.renderableMap.set(mRenderable, database);

    return true;
  }

  /**
   * Get animations associated with a renderable.
   * @param {object} mRenderable - The renderable object.
   * @returns {array|null} - An array of animations associated with the renderable, or null if renderable is null.
   */
  getAnimations(mRenderable) {
    if (mRenderable === null) return null;
    if(!this.renderableMap.has(mRenderable)) return null;

    let database = this.renderableMap.get(mRenderable);
    if(!database.hasAnimation()) return null;


    return database.getAnimations();
  }

  /**
   * Create a new animation and add it to the renderable map.
   * @param {object} mRenderable - The renderable object for which the animation is created.
   * @returns {object|null} - The newly created animation, or null if renderable is null.
   */
  newAnimation(mRenderable) {
    // Check if renderable is null
    if (mRenderable === null) return null;

    //check if map already has renderable
    if(this.renderableMap.has(mRenderable)) this.setRenderable(mRenderable)
    // other safety check here? Ensure renderable is renderable

    // Create a new animation
    let toAdd = new Animation(mRenderable);

    // Add the new animation to the list
    this.renderableMap.get(mRenderable).addAnimation(toAdd);

    return toAdd;
  }

  

  update() {
    for (let database of this.renderableMap.values()) {
      database.player.update();
    }
  }

  play() {
    for (let database of this.renderableMap.values()) {
      database.playAnimation();
    }
  }

  pause() {
    for (let database of this.renderableMap.values()) {
      database.pauseAnimation();
    }
  }
}

export default KeyFramer;
