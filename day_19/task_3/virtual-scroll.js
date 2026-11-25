const viewport = document.querySelector("#scroll-viewport");
const spacer = document.querySelector("#scroll-spacer");
const renderedItems = document.querySelector("#rendered-items");

const totalCount = document.querySelector("#total-count");
const renderedCount = document.querySelector("#rendered-count");
const visibleRange = document.querySelector("#visible-range");

const TOTAL_ITEMS = 10000;
const ITEM_HEIGHT = 48;
const BUFFER_SIZE = 5;

// Generate an array containing 10,000 items.
const items = Array.from({ length: TOTAL_ITEMS }, (_, index) => ({
    id: index + 1,
    name: `Item ${index + 1}`
}));

// Set the total scrollable height.
spacer.style.height = `${TOTAL_ITEMS * ITEM_HEIGHT}px`;
totalCount.textContent = TOTAL_ITEMS;

// Render only the required items.
function renderVisibleItems() {
    const scrollTop = viewport.scrollTop;

    // Calculate the first visible item.
    const start = Math.floor(scrollTop / ITEM_HEIGHT);
    const visibleCount = Math.ceil(viewport.clientHeight / ITEM_HEIGHT);

    // Include buffer items above and below the viewport.
    const renderStart = Math.max(0, start - BUFFER_SIZE);
    const renderEnd = Math.min(TOTAL_ITEMS, start + visibleCount + BUFFER_SIZE);
    const fragment = document.createDocumentFragment();

    // Create DOM elements only for the required range.
    for (let i = renderStart; i < renderEnd; i++) {
        const item = items[i];
        const element = document.createElement("div");
        element.className = "list-item";
        element.textContent = `${item.id}. ${item.name}`;
        fragment.appendChild(element);
    }

    // Replace previously rendered items.
    renderedItems.replaceChildren(fragment);

    // Position rendered items at their correct scroll location.
    renderedItems.style.transform = `translateY(${renderStart * ITEM_HEIGHT}px)`;

    // Update information displayed above the list.
    renderedCount.textContent = renderEnd - renderStart;
    visibleRange.textContent = `${renderStart + 1} - ${renderEnd}`;
}

// rAF throttle: schedule at most one render per animation frame.
let animationFrameId = null;

function scheduleRender() {
    if (animationFrameId !== null) return;
    animationFrameId = requestAnimationFrame(() => {
        animationFrameId = null;
        renderVisibleItems();
    });
}

// Debounce the final update after scrolling settles.
let debounceTimer = null;

function handleScroll() {
    // Update continuously, but only once per animation frame.
    scheduleRender();

    // Schedule a final update after scrolling stops.
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        scheduleRender();
    }, 100);
}

// Listen for scrolling.
viewport.addEventListener("scroll", handleScroll);

// Initial rendering.
renderVisibleItems();
