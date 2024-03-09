/**
 * File: key_framer.js
 *       Encapsulates key frame animation functionality
 */
"use strict";

import Animation from "./animation.js";

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
    if (mRenderable === null) return null;

    // Use reference to renderable as key and store an empty list of animations
    this.renderableMap.set(mRenderable, []);

    // Return the empty list
    return this.renderableMap.get(mRenderable);
  }

  /**
   * Get animations associated with a renderable.
   * @param {object} mRenderable - The renderable object.
   * @returns {array|null} - An array of animations associated with the renderable, or null if renderable is null.
   */
  getAnimations(mRenderable) {
    if (mRenderable == null) return null;
    return this.renderableMap.get(mRenderable);
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

    // Get current animations list associated with renderable
    let currAnimations = this.renderableMap.get(mRenderable);

    // Create a new animation
    let toAdd = new Animation(mRenderable);

    // Add the new animation to the list
    currAnimations.push(toAdd);

    // Update the renderable map
    this.renderableMap.set(mRenderable, toAdd);

    return toAdd;
  }
}

export default KeyFramer;
