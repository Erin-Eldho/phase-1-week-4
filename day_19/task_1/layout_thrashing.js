/* global performance */

export function initLayoutThrashing() {
    const itemsContainer = document.querySelector("#layout-test-items");
    const status = document.querySelector("#layout-test-status");
    if (!itemsContainer || !status) {
        return;
    }
    const ITEM_COUNT = 1000;
    const fragment = document.createDocumentFragment();
    for (let i = 1; i <= ITEM_COUNT; i++) {
        const item = document.createElement("div");
        item.className = "layout-lab__item";
        item.textContent = `Test Element ${i}`;

        fragment.appendChild(item);
    }

    itemsContainer.appendChild(fragment);
    const items = Array.from(itemsContainer.children);
    function runUnoptimized() {
        const startTime = performance.now();
        for (const item of items) {
            const height = item.offsetHeight;
            item.style.height = `${height + 1}px`;
        }
        const duration = performance.now() - startTime;
        status.textContent = `Unoptimized execution time: ${duration.toFixed(2)} ms`;
        console.log(`Unoptimized execution time: ${duration.toFixed(2)} ms`);
    }

    function runOptimized() {
        const startTime = performance.now();
        const heights = items.map(item => item.offsetHeight);
        items.forEach((item, index) => {
            item.style.height = `${heights[index] + 1}px`;
        });
        const duration = performance.now() - startTime;
        status.textContent = `Optimized execution time: ${duration.toFixed(2)} ms`;
        console.log(`Optimized execution time: ${duration.toFixed(2)} ms`);
    }

    function resetLayoutTest() {
        items.forEach(item => {
            item.style.height = "";
        });
        status.textContent = "Heights reset. Ready for the next test.";
    }

    document.querySelector("#run-thrashing").addEventListener("click", runUnoptimized);
    document.querySelector("#run-optimized").addEventListener("click", runOptimized);
    document.querySelector("#reset-layout-test").addEventListener("click", resetLayoutTest);
}
