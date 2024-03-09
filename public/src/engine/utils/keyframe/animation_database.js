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
        this.currentAnimationIndex = 0;
    }

    /**
     * Set the current animation by index.
     * @param {number} index - Index of the animation to set as current.
     */
    setCurrentAnimation(index) {
        // Check if the provided index is valid
        if (index >= 0 && index < this.animationStorage.length) {
            // Set the current animation index
            this.currentAnimationIndex = index;
        } else {
            console.error("Invalid animation index provided.");
        }
    }

    /**
     * Get all animations stored in the database.
     * @returns {Array} - Array of animations.
     */
    getAnimations() {
        return this.animationStorage;
    }

    /**
     * Add a new animation to the database.
     * @param {*} animation - The animation to add.
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
        // Start playing the animation using the AnimationPlayer
        this.player.start(this.animationStorage[this.currentAnimationIndex]);
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
