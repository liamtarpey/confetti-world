
/**
 * Creates a confetti particle.
 * On every loop, draw() gets called and creates the path that the canvas will draw.
 */
export class ConfettiParticle {

    constructor(parentContext, color) {
        const { config, viewport, canvas } = parentContext;

        const randomFromTo = (from, to) => {
            return (Math.floor(Math.random() * ((to - from) + 1)) + from);
        };

        this.x = Math.random() * viewport.width;
        this.y = (Math.random() * viewport.height) - viewport.height;
        this.r = randomFromTo(10, 30); // radius
        this.d = (Math.random() * config.maxParticles) + 10; // density
        this.color = color;
        this.tilt = Math.floor(Math.random() * 10) - 10;
        this.tiltAngleIncremental = (Math.random() * 0.07) + 0.05;
        this.tiltAngle = 0;

        this.draw = function() {
            canvas.context.beginPath();
            canvas.context.lineWidth = this.r / 2;
            canvas.context.strokeStyle = this.color;
            canvas.context.moveTo(this.x + this.tilt + (this.r / 4), this.y);
            canvas.context.lineTo(this.x + this.tilt, this.y + this.tilt + (this.r / 4));
            return canvas.context.stroke();
        };
    }
}
