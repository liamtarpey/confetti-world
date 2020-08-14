import ConfettiWorld from './components/confetti-world.js';

// Initialise
(function() {
    const DOMElement = document.getElementById('confetti-item');
    const instance = new ConfettiWorld(DOMElement, {
        // colors:  ['#ccc', '#aaa', '#000', '#fff333']
        maxParticles: 40
    });
})();
