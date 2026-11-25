const TOTAL_ITEMS = 1000;
const ITEM_HEIGHT = 30;
const VISIBLE_ITEMS = 20;

// 1. Benchmark regular DOM rendering
function renderRegularList() {
    const container = document.getElementById("regular-list");
    container.replaceChildren();
    const start = performance.now();
    const fragment = document.createDocumentFragment();

    for (let i = 1; i <= TOTAL_ITEMS; i++) {
        const item = document.createElement("div");
        item.className = "list-item";
        item.textContent = `Item ${i}`;
        fragment.appendChild(item);
    }
    container.appendChild(fragment);
    void container.offsetHeight;
    const duration = performance.now() - start;
    document.getElementById("regular-time").textContent = `Rendering time: ${duration.toFixed(2)} ms`;
    console.log(`Regular DOM: ${duration.toFixed(2)} ms`);
}

// 2. Benchmark virtual scrolling
function renderVirtualList() {
    const container = document.getElementById("virtual-list");
    const spacer = document.getElementById("virtual-spacer");
    const visibleContainer = document.getElementById("virtual-items");
    spacer.style.height = `${TOTAL_ITEMS * ITEM_HEIGHT}px`;

    function updateVisibleItems() {
        const startIndex = Math.floor(
            container.scrollTop / ITEM_HEIGHT
        );
        const endIndex = Math.min(
            startIndex + VISIBLE_ITEMS,
            TOTAL_ITEMS
        );
        const fragment = document.createDocumentFragment();
        for (let i = startIndex; i < endIndex; i++) {
            const item = document.createElement("div");
            item.className = "list-item";
            item.textContent = `Item ${i + 1}`;
            fragment.appendChild(item);
        }
        visibleContainer.replaceChildren(fragment);
        visibleContainer.style.transform = `translateY(${startIndex * ITEM_HEIGHT}px)`;
    }

    const start = performance.now();
    container.scrollTop = 0;
    updateVisibleItems();
    void container.offsetHeight;
    const duration = performance.now() - start;
    document.getElementById("virtual-time").textContent = `Rendering time: ${duration.toFixed(2)} ms`;
    console.log(`Virtual scroll initialization: ${duration.toFixed(2)} ms`);
    console.log(`Virtual list DOM items: ${visibleContainer.children.length}`);
    container.onscroll = updateVisibleItems;
}

function initBenchmark() {
    const button = document.getElementById("run-benchmark");
    if (!button) return;
    button.addEventListener("click", () => {
        renderRegularList();
        renderVirtualList();
    });
}

// 3. PerformanceObserver: LCP and CLS
function initPerformanceObserver() {
    if (!("PerformanceObserver" in window)) {
        console.log("PerformanceObserver is not supported.");
        return;
    }
    try {
        const lcpObserver = new PerformanceObserver(list => {
            const entries = list.getEntries();
            entries.forEach(entry => {
                console.log("LCP:", entry.startTime.toFixed(2), "ms");
                const result = document.getElementById("lcp-result");
                if (result) {
                    result.textContent = `LCP: ${entry.startTime.toFixed(2)} ms`;
                }
            });
        });
        lcpObserver.observe({
            type: "largest-contentful-paint",
            buffered: true
        });
    } catch (error) {
        console.log("LCP observation is not supported.");
    }
    try {
        let cumulativeLayoutShift = 0;
        if (PerformanceObserver.supportedEntryTypes.includes("layout-shift")) {
            const clsObserver = new PerformanceObserver(entries => {
                entries.getEntries().forEach(entry => {
                    if (!entry.hadRecentInput) {
                        cumulativeLayoutShift += entry.value;
                    }
                });
                document.getElementById("cls-result").textContent = `CLS: ${cumulativeLayoutShift.toFixed(4)}`;
            });
            clsObserver.observe({type: "layout-shift", buffered: true});
        }
    } catch (error) {
        console.log("CLS observation is not supported.");
    }
}

// 4. Detect slow connections and disable autoplay
export function initConnectionMonitor() {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

    if (!connection) {
        console.log("Network Information API is not supported.");
        return;
    }

    function checkConnection() {
        const effectiveType = connection.effectiveType;
        const isSlow = connection.saveData || ["slow-2g", "2g", "3g"].includes(effectiveType);

        document.documentElement.classList.toggle("slow-connection", isSlow );
        if (isSlow) {
            document.querySelectorAll("[autoplay]").forEach(media => {
                if (typeof media.pause === "function") {
                    media.pause();
                }
                media.removeAttribute("autoplay");
            });
            console.log(`Slow connection detected (${effectiveType}). Autoplay and animations disabled.`);
        } else {
            console.log(`Normal connection detected (${effectiveType}).`);
        }
    }
    checkConnection();
    connection.addEventListener("change", checkConnection);
}

// Initialize standalone test-page features only
if (document.getElementById("run-benchmark")) {
    initBenchmark();
}
if (document.getElementById("lcp-result")) {
    initPerformanceObserver();
}
