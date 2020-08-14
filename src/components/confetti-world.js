import {defaultConfig} from './confetti-world.config.js';
import {ConfettiParticle} from './confetti-particle.js';

export default class ConfettiWorld {

    constructor(DOMElement, customConfig = {}) {

        this.particles = [];

        this.viewport = {
            width: null,
            height: null
        };

        this.canvas = {
            element: DOMElement,
            context: null
        };

        // Animation handler
        this.animationHandler = null;

        this.config = Object.assign({}, defaultConfig, customConfig);

        // Init
        this.setGlobals();
        this.initializeConfetti();
        this.initialiseResizeHandler();
    }

    // TODO: add debounce
    initialiseResizeHandler() {
        window.addEventListener('resize', this.setCanvasDimensions.bind(this));
    }

    /**
     * Picks a random colour from the busuuColors array
     * @return {String} hex value
     */
    getColor() {
        const {colors} = this.config;
        return colors[Math.floor(Math.random() * colors.length)];
    }

    setCanvasDimensions() {
        // Get the window dimensions
        this.viewport.width = window.innerWidth;
        this.viewport.height = window.innerHeight;

        // Set the canvas sizes
        this.canvas.element.width = this.viewport.width;
        this.canvas.element.height = this.viewport.height;
    }

    /**
     * Get the width and height of the inner browser window
     * Set these as width/height attributes on the canvas
     * This function is called on init and also on resize events.
     */
    setGlobals() {
        this.canvas.context = this.canvas.element.getContext('2d');
        this.setCanvasDimensions();
    }

    /**
     * Function that calls the particle draw constructor.
     * Clears the previous draw of all particles and updates
     * them so that they can move down the screen.
     */
    draw() {
        const {maxParticles} = this.config;
        this.canvas.context.clearRect(0, 0, this.viewport.width, this.viewport.height);

        for (var i = 0; i < maxParticles; i++) {
            this.particles[i].draw();
        }

        this.update();
    }

    /**
     * Called on every loop to move the position of the particle down the screen.
     * @param {Node} particle
     * @param {Index} index of particle in particle array
     */
    stepParticle(particle, particleIndex) {
        const {angle, particleSpeed} = this.config;
        particle.tiltAngle += particle.tiltAngleIncremental;
        particle.y += ((Math.cos(angle + particle.d) + (particleSpeed + particle.r)) / 2) / 2;
        particle.x += Math.sin(angle);
        particle.tilt = (Math.sin(particle.tiltAngle - (particleIndex / 3))) * 15;
    }

    /**
     * This checks if the particle has reached the bottom of the screen resets it back to the top
     * 66.67% of the flakes (index % 5 > 0 || index % 2 === 0) enter from the top and the remaining percent enter from the sides
     * This is to create a random effect and make the confetti falling a bit less static and repetitive.
     * @param {Node} particle
     * @param {Index}
     */
    checkForReposition(particle, index) {
        const {angle} = this.config;
        if ((particle.x > this.viewport.width + 20 || particle.x < -20 || particle.y > this.viewport.height)) {
            if (index % 5 > 0 || index % 2 === 0) {
                this.repositionParticle(particle, Math.random() * this.viewport.width, -10, Math.floor(Math.random() * 10) - 10);
            } else if (Math.sin(angle) > 0) { // Enter from the left
                this.repositionParticle(particle, -5, Math.random() * this.viewport.height, Math.floor(Math.random() * 10) - 10);
            } else { // Enter from the right
                this.repositionParticle(particle, this.viewport.width + 5, Math.random() * this.viewport.height, Math.floor(Math.random() * 10) - 10);
            }
        }
    }

    /**
     * Repositions a particle to the top of the screen when it has reached the bottom
     * @param {Node} particle
     * @param {Number} x-axis position to reposition to
     * @param {Number} y-axis position to reposition to
     * @param {Number} the tilt of the particle
     */
    repositionParticle(particle, xCoordinate, yCoordinate, tilt) {
        particle.x = xCoordinate;
        particle.y = yCoordinate;
        particle.tilt = tilt;
    }

    /**
     * Updates the current angle for all particles
     * Then proceeds to loop through the particles to reposition them on the screen.
     * stepParticle moves the particle down the screen
     * checkForReposition moves the particle back to the top of the screen if it has reached the bottom.
     */
    update() {
        this.config.angle += 0.01;

        const {maxParticles} = this.config;
        for (var i = 0; i < maxParticles; i++) {
            this.stepParticle(this.particles[i], i);
            this.checkForReposition(this.particles[i], i);
        }
    }

    /**
     * Starts the confetti loop.
     * The loop uses requestAnimationFrame to ensure the browser updates the animation before a repaint
     * This helps with performance and ensures helps the browser to stop lag during animations.
     */
    startConfetti() {
        const animLoop = () => {
            this.animationHandler = window.requestAnimationFrame(animLoop);
            return this.draw();
        };

        animLoop();
    }

    /**
     * Initialises our particle array.
     * First we pick a random colour from our colours array
     * and then we push a new confetti particle to the particle array.
     * startConfetti initialises our loop.
     */
    initializeConfetti() {

        for (let i = 0; i < this.config.maxParticles; i++) {
            const particleColor = this.getColor();
            this.particles.push(new ConfettiParticle(this, particleColor));
        }

        this.startConfetti();
    }

    destroy() {
        if (this.animationHandler) {
            window.cancelAnimationFrame(this.animationHandler);
        }
    }
}
