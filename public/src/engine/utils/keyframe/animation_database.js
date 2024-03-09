import AnimationPlayer from "./animation_player.js";

class AnimationDatabase {
    constructor(mRenderable) {
        this.player = new AnimationPlayer(mRenderable);
        this.animationStorage = [];
        this.currentAnimationIndex = 0;
    }

    setCurrentAnimation(index) {
        if (index + 1 < this.animationStorage.length || index === -1) {
            this.currentAnimationIndex = this.animationStorage.length - 1;
        }
        this.currentAnimationIndex = index;
    }

    getAnimations() {
        return this.animationStorage;
    }

    addAnimation(animation) {
        this.animationStorage.push(animation);
    }

    pauseAnimation() {
        this.player.pause();
    }
    
    playAnimation() {
        this.player.start(this.animationStorage[this.currentAnimationIndex]);
    }

    hasAnimation() {
        return this.animationStorage.length !== 0;
    }
}

export default AnimationDatabase;