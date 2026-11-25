const counter = document.querySelector("#counter");
const particleCanvas = document.querySelector("#particle-canvas");
const particleContext = particleCanvas.getContext("2d");

const pauseButton = document.querySelector("#pause-animation");
const resumeButton = document.querySelector("#resume-animation");

const PARTICLE_COUNT = 200;
const COUNTER_DURATION = 2000;
const COUNTER_TARGET = 1000;

let animationId = null;
let isPaused = false;
let startTime = performance.now();
let pauseTime = 0;
let previousFrameTime = 0;

// Ease-out-cubic easing function
function easeOutCubic(progress) {
    return 1 - Math.pow(1 - progress, 3);
}

// Create 200 particles with random positions, velocities, and colours.
const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
    x: Math.random() * particleCanvas.width,
    y: Math.random() * particleCanvas.height,
    vx: (Math.random() - 0.5) * 4,
    vy: (Math.random() - 0.5) * 4,
    radius: Math.random() * 3 + 1,
    color: `hsl(${Math.random() * 360}, 80%, 60%)`
}));

// Update the animated counter.
function updateCounter(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / COUNTER_DURATION, 1);
    const easedProgress = easeOutCubic(progress);
    const currentValue = Math.round(easedProgress * COUNTER_TARGET);
    counter.textContent = currentValue;
}

// Update particle positions.
function updateParticles(deltaTime) {
    const frameScale = deltaTime / (1000 / 60);

    particles.forEach(particle => {
        particle.x += particle.vx * frameScale;
        particle.y += particle.vy * frameScale;

        // Bounce off the horizontal boundaries.
        if (particle.x <= particle.radius || particle.x >= particleCanvas.width - particle.radius) {
            particle.vx *= -1;
        }

        // Bounce off the vertical boundaries.
        if (particle.y <= particle.radius || particle.y >= particleCanvas.height - particle.radius) {
            particle.vy *= -1;
        }
    });
}

// Draw all particles on the particleCanvas.
function drawParticles() {
    particleContext.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
    particles.forEach(particle => {
        particleContext.beginPath();
        particleContext.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        particleContext.fillStyle = particle.color;
        particleContext.fill();
    });
}

// Main animation loop.
function animate(currentTime) {
    if (isPaused) return;
    const deltaTime = previousFrameTime ? currentTime - previousFrameTime : 1000 / 60;
    previousFrameTime = currentTime;

    // Use performance.now() for counter timing.
    updateCounter(performance.now());
    updateParticles(deltaTime);
    drawParticles();
    animationId = requestAnimationFrame(animate);
}

// Start or resume the animation.
function startAnimation() {
    if (animationId !== null) return;
    isPaused = false;
    previousFrameTime = 0;
    animationId = requestAnimationFrame(animate);
}

// Pause the animation.
function pauseAnimation() {
    if (animationId === null) return;
    isPaused = true;
    pauseTime = performance.now();
    cancelAnimationFrame(animationId);
    animationId = null;
}

// Resume without counting the paused duration.
function resumeAnimation() {
    if (!isPaused) return;
    const pausedDuration = performance.now() - pauseTime;
    startTime += pausedDuration;
    startAnimation();
}

pauseButton.addEventListener("click", () => {
    pauseAnimation();
    pauseButton.disabled = true;
    resumeButton.disabled = false;
});

resumeButton.addEventListener("click", () => {
    resumeAnimation();
    pauseButton.disabled = false;
    resumeButton.disabled = true;
});

startAnimation();
