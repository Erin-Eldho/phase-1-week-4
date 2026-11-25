// 1. Lazy Image Loader
function initLazyImages() {
    const images = document.querySelectorAll("img[data-src]");
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const image = entry.target;
                image.src = image.dataset.src;
                image.removeAttribute("data-src");
                observer.unobserve(image);
            }
        });
    });
    images.forEach(image => imageObserver.observe(image));
}


// 2. Sticky Section Header
function initStickyHeader() {
    const miniHeader = document.getElementById("sticky-header");
    const sections = document.querySelectorAll("main section");
    if (!miniHeader) return;
    const headerObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.boundingClientRect.top < 0 && !entry.isIntersecting) {
                miniHeader.textContent = entry.target.querySelector("h2")?.textContent || "";
                miniHeader.classList.add("visible");
            } else if (entry.isIntersecting && entry.boundingClientRect.top >= 0) {
                miniHeader.classList.remove("visible");
            }
        });
    }, {
        rootMargin: "-1px 0px 0px 0px",
        threshold: 0
    });
    sections.forEach(section => headerObserver.observe(section));
}


// 3. Count-up Animations
function initCountUp() {
    const stats = document.querySelectorAll(".stat-number");
    const statsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const target = Number(element.dataset.target);
                const duration = 2000;
                const startTime = performance.now();
                function updateCount(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const currentValue = Math.floor(target * progress);
                    element.textContent = currentValue;
                    if (progress < 1) {
                        requestAnimationFrame(updateCount);
                    } else {
                        element.textContent = target;
                    }
                }
                requestAnimationFrame(updateCount);
                observer.unobserve(element);
            }
        });
    }, {
        threshold: 0.5
    });
    stats.forEach(stat => statsObserver.observe(stat));
}


initLazyImages();
initStickyHeader();
initCountUp();
