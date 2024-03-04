/**
 * File: key_framer.js
 *       Encapsulates key frame animation functionality
 */
"use strict";

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
    if (mRenderable == null) return null;

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

/**
 * Class representing an animation.
 */
class Animation {
  /**
   * Create an Animation.
   * @param {object} mRenderable - The renderable object associated with this animation.
   */
  constructor(mRenderable) {
    // Initialize animation properties
    this.mRenderable = mRenderable;
    this.firstFrame = null;
    this.lastFrame = null;
  }

  /**
   * Add a frame to the animation.
   * @param {object} mRenderable - The renderable object for the frame.
   * @param {number} [index=null] - The index of the frame (in seconds).
   * @returns {boolean} - True if the frame is added successfully, false otherwise.
   */
  addFrame(mRenderable, index = null) {
    // Check if renderable is null
    if (mRenderable === null) return false;

    // Create a new frame
    let newFrame = new Frame(mRenderable, index * 60);
    
    // Handle cases for adding frames
    if (this.isEmpty()) {
      newFrame.frameIndex = 0;
      this.firstFrame = newFrame;
      this.lastFrame = newFrame;
      return false;
    } else if (index === null) {
      newFrame.frameIndex = this.lastFrame.frameIndex + 60;
      this.lastFrame.next = newFrame;
      this.lastFrame = newFrame;
      return false;
    } else {
      let prevFrame = this.getFrameBeforeIndex(index * 60);
      if (prevFrame.next !== null && index * 60 === prevFrame.next.frameIndex) return false;
      newFrame.next = prevFrame.next;
      prevFrame.next = newFrame;   
      this.lastFrame = newFrame;
      return true;
    }
  }

  /**
   * Get the first frame of the animation.
   * @returns {object|null} - The first frame of the animation, or null if animation is empty.
   */
  getFirstFrame() { return this.firstFrame; }

  /**
   * Check if the animation is empty.
   * @returns {boolean} - True if the animation is empty, false otherwise.
   */
  isEmpty() { return this.firstFrame === null; }

  /**
   * Delete a frame from the animation.
   * @param {number} [index=null] - The index of the frame to delete (in seconds).
   * @returns {boolean} - True if the frame is deleted successfully, false otherwise.
   */
  deleteFrame(index = null) {
    if (this.isEmpty()) return false;
    if (index === null) index = this.lastFrame.frameIndex;
    let prevFrame = this.getFrameBeforeIndex(index);
    prevFrame.next = prevFrame.next.next;
    return true;
  }

  /**
   * Get the frame before a given index.
   * @param {number} index - The index of the frame (in seconds).
   * @returns {object} - The frame before the given index.
   */
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

/**
 * Class representing a frame.
 */
class Frame {
  /**
   * Create a Frame.
   * @param {object} mRenderable - The renderable object associated with this frame.
   * @param {number} index - The index of the frame (in seconds).
   */
  constructor(mRenderable, index) {
    // Initialize frame properties
    this._width = mRenderable.getXform().getWidth();
    this._height = mRenderable.getXform().getWidth();
    this._XPos = mRenderable.getXform().getXPos();
    this._YPos = mRenderable.getXform().getYPos();
    this._rotationInDegree = mRenderable.getXform().getRotationInDegree();
    this._color = mRenderable.getColor();

    this.frameIndex = index;
    this.next = null;
  }

  /**
   * Get the X position of the frame.
   * @returns {number} - The X position of the frame.
   */
  getXPos() { return this._XPos; }

  /**
   * Get the Y position of the frame.
   * @returns {number} - The Y position of the frame.
   */
  getYPos() { return this._YPos; }

  /**
   * Get the width of the frame.
   * @returns {number} - The width of the frame.
   */
  getWidth() { return this._width; }

  /**
   * Get the height of the frame.
   * @returns {number} - The height of the frame.
   */
  getHeight() { return this._height; }

  /**
   * Get the rotation in degree of the frame.
   * @returns {number} - The rotation in degree of the frame.
   */
  getRotationInDegree() { return this._rotationInDegree; }

  /**
   * Get the color of the frame.
   * @returns {array} - The color of the frame.
   */
  getColor() { return this._color; }
}

export default KeyFramer;
