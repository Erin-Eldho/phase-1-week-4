const items = Array.from({ length: 10000 }, (_, index) => ({
    id: index + 1,
    name: `Item ${index + 1}`
}));
const container = document.getElementById("list-container");
const spacer = document.getElementById("list-spacer");
const visibleContainer = document.getElementById("visible-items");
const itemHeight = 40;
const buffer = 10;
spacer.style.height = `${items.length * itemHeight}px`;

function renderVisibleItems() {
    const scrollTop = container.scrollTop;
    const containerHeight = container.clientHeight;
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - buffer);
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const endIndex = Math.min(items.length, startIndex + visibleCount + buffer * 2);
    visibleContainer.innerHTML = "";
    const fragment = document.createDocumentFragment();
    items.slice(startIndex, endIndex).forEach(item => {
        const element = document.createElement("div");
        element.className = "list-item";
        element.textContent = `${item.id}. ${item.name}`;
        fragment.appendChild(element);
    });
    visibleContainer.appendChild(fragment);
    visibleContainer.style.transform = `translateY(${startIndex * itemHeight}px)`;
}

container.addEventListener("scroll", renderVisibleItems);
renderVisibleItems();
