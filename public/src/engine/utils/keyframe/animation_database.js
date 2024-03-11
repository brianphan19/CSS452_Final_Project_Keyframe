import AnimationPlayer from "./animation_player.js";

// Class for managing animations
class AnimationDatabase {
    // Constructor method
    constructor(mRenderable) {
        // Initialize the AnimationPlayer with a renderable object
        this.player = new AnimationPlayer(mRenderable);
        // Array to store animations
        this.animationStorage = [];
        // Index of the current animation being played
        this.activeAnimationIndex = 0;
    }

    /**
     * Set the current animation by index.
     * @param {number} index - Index of the animation to set as current.
     */
    setActiveAnimation(index) {
        // Check if the provided index is invalid
        if (index + 1 > this.animationStorage.length || index < 0) {
            this.activeAnimationIndex = this.animationStorage.length - 1;
            return;
        }
        this.activeAnimationIndex = index;
    }

    /**
     * Get all animations stored in the database.
     * @returns {Array} - Array of animations.
     */
    getAnimations() {
        return this.animationStorage;
    }

    getActiveAnimation() {
        return this.animationStorage[this.activeAnimationIndex];
    }

    getActiveAnimationIndex() {
        return this.activeAnimationIndex;
    }

    /**
     * Add a new animation to the database.
     * @param {object} animation - The animation to add.
     */
    addAnimation(animation) {
        this.animationStorage.push(animation);
    }

    /**
     * Pause the currently playing animation.
     */
    pauseAnimation() {
        this.player.pause();
    }
    
    /**
     * Play the animation at the current index.
     */
    playAnimation() {
        // Start playing the active animation using the AnimationPlayer
        this.player.start(this.animationStorage[this.activeAnimationIndex]);
    }

    /**
     * Check if there are any animations stored in the database.
     * @returns {boolean} - True if there are animations, otherwise false.
     */
    hasAnimation() {
        return this.animationStorage.length !== 0;
    }
}

// Export the AnimationDatabase class as the default export
export default AnimationDatabase;
