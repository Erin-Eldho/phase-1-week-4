const COUNT_DURATION = 2000;
const UPLOAD_INTERVAL = 250;
const ANIMATION_DURATION = 1800;

// 1. Count-up animation using requestAnimationFrame
function initCountUp() {
    const button = document.getElementById("start-count");
    const counters = document.querySelectorAll(".count-value");

    button.addEventListener("click", () => {
        button.disabled = true;
        counters.forEach(counter => {
            counter.textContent = "0";
        });
        let startTime = null;

        function animate(timestamp) {
            if (startTime === null) {
                startTime = timestamp;
            }

            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / COUNT_DURATION, 1);
            const easedProgress = 1 - Math.pow(1 - progress, 3);

            counters.forEach(counter => {
                const target = Number(counter.dataset.target);
                const currentValue = Math.round(target * easedProgress);
                counter.textContent = currentValue.toLocaleString("en-IN");
            });

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                button.disabled = false;
            }
        }
        requestAnimationFrame(animate);
    });
}

// 2. Mock upload using setTimeout and requestAnimationFrame
function initUploadProgress() {
    const button = document.getElementById("start-upload");
    const progress = document.getElementById("upload-progress");
    const fill = document.getElementById("progress-fill");
    const status = document.getElementById("upload-status");

    button.addEventListener("click", () => {
        let targetProgress = 0;
        let displayedProgress = 0;
        let uploadComplete = false;

        button.disabled = true;
        fill.classList.add("is-animating");
        status.textContent = "Uploading...";

        progress.setAttribute("aria-valuenow", "0");
        fill.style.transform = "scaleX(0)";

        function mockUpload() {
            targetProgress = Math.min(targetProgress + 10, 100);
            if (targetProgress < 100) {
                setTimeout(mockUpload, UPLOAD_INTERVAL);
            } else {
                uploadComplete = true;
            }
        }

        function animateProgress() {
            const difference = targetProgress - displayedProgress;
            displayedProgress += difference * 0.15;

            if (uploadComplete && difference < 0.1) {
                displayedProgress = 100;
            }

            fill.style.transform = `scaleX(${displayedProgress / 100})`;
            progress.setAttribute("aria-valuenow", String(Math.round(displayedProgress)));

            if (displayedProgress >= 100) {
                fill.classList.remove("is-animating");
                status.textContent = "Upload completed!";
                button.disabled = false;
                return;
            }
            requestAnimationFrame(animateProgress);
        }
        mockUpload();
        requestAnimationFrame(animateProgress);
    });
}

// 3 and 4. Compare layout and compositor-friendly animations
function runComparison(track, box, animationType, button) {
    button.disabled = true;
    const maxX = track.clientWidth - box.offsetWidth;
    const maxY = track.clientHeight - box.offsetHeight;
    let startTime = null;

    if (animationType === "layout") {
        box.style.left = "0px";
        box.style.top = "0px";
    } else {
        box.style.transform = "translate(0px, 0px)";
        box.style.opacity = "1";
        box.classList.add("is-animating");
    }

    function animate(timestamp) {
        if (startTime === null) {
            startTime = timestamp;
        }

        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / ANIMATION_DURATION, 1);
        const x = maxX * progress;
        const y = maxY * progress;
        const opacity = 1 - (progress * 0.5);

        if (animationType === "layout") {
            box.style.left = `${x}px`;
            box.style.top = `${y}px`;
        } else {
            box.style.transform = `translate(${x}px, ${y}px)`;
            box.style.opacity = opacity;
        }

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            box.classList.remove("is-animating");
            button.disabled = false;
        }
    }
    requestAnimationFrame(animate);
}

function initAnimationComparison() {
    const layoutTrack = document.getElementById("layout-track");
    const layoutBox = document.getElementById("layout-box");
    const layoutButton = document.getElementById("start-layout");
    const compositorTrack = document.getElementById("compositor-track");
    const compositorBox = document.getElementById("compositor-box");
    const compositorButton = document.getElementById("start-compositor");

    layoutButton.addEventListener("click", () => {
        runComparison(
            layoutTrack,
            layoutBox,
            "layout",
            layoutButton
        );
    });

    compositorButton.addEventListener("click", () => {
        runComparison(
            compositorTrack,
            compositorBox,
            "compositor",
            compositorButton
        );
    });
}

initCountUp();
initUploadProgress();
initAnimationComparison();
